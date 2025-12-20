const fs = require('fs');
const path = require('path');
const db = require('../config/db');

function findLatestLog(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('fk-apply-log-') && f.endsWith('.json'));
  if (files.length === 0) return null;
  files.sort();
  return path.join(dir, files[files.length - 1]);
}

function parseFkAlter(stmt) {
  // Extract child table, child column, parent table, parent column
  const m = stmt.match(/ALTER\s+TABLE\s+`?([a-zA-Z0-9_]+)`?\s+ADD\s+CONSTRAINT\s+`?[a-zA-Z0-9_]+`?\s+FOREIGN\s+KEY\s*\((`?[a-zA-Z0-9_]+`?)\)\s+REFERENCES\s+`?([a-zA-Z0-9_]+)`?\s*\((`?[a-zA-Z0-9_]+`?)\)/i);
  if (!m) return null;
  const childTable = m[1];
  const childCol = m[2].replace(/`/g,'');
  const parentTable = m[3];
  const parentCol = m[4].replace(/`/g,'');
  return { childTable, childCol, parentTable, parentCol };
}

async function main() {
  const logDir = path.join(__dirname, '..', 'db');
  const logPath = findLatestLog(logDir);
  if (!logPath) {
    console.error('No fk-apply-log file found in', logDir);
    process.exit(1);
  }
  const log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  await db.connect();
  const sequelize = db.sequelize;

  const failedAlters = log.results.filter(r => !r.ok && /ALTER\s+TABLE/i.test(r.statement));
  if (failedAlters.length === 0) {
    console.log('No failed ALTER TABLE statements to retry in', logPath);
    process.exit(0);
  }

  for (const f of failedAlters) {
    console.log('\nProcessing failed statement:');
    console.log(f.statement);
    const parsed = parseFkAlter(f.statement);
    if (!parsed) {
      console.warn('Could not parse FK alter statement, skipping');
      continue;
    }
    const { childTable, childCol, parentTable, parentCol } = parsed;
    try {
      // Get parent column type reliably from information_schema
      const q = `SELECT COLUMN_TYPE, IS_NULLABLE, DATA_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`;
      const rows = await sequelize.query(q, { replacements: [parentTable, parentCol], type: db.Sequelize.QueryTypes.SELECT });
      if (!rows || rows.length === 0) {
        console.warn('Could not determine parent column type for', parentTable, parentCol);
        continue;
      }
      const parentDef = rows[0].COLUMN_TYPE; // e.g. int(11) unsigned
      const isNullable = rows[0].IS_NULLABLE === 'YES';
      const typeToken = parentDef;
      console.log('Parent column definition from information_schema:', parentDef, 'nullable:', isNullable);
      // Alter child column to match parent type
      const usesSetNull = /ON\s+DELETE\s+SET\s+NULL/i.test(f.statement);
      const alterSql = usesSetNull
        ? `ALTER TABLE \`${childTable}\` MODIFY \`${childCol}\` ${typeToken} DEFAULT NULL`
        : `ALTER TABLE \`${childTable}\` MODIFY \`${childCol}\` ${typeToken} ${isNullable ? 'DEFAULT NULL' : 'NOT NULL'}`;
      console.log('Altering child column with SQL:', alterSql);
      await sequelize.query(alterSql);
      console.log('Child column type adjusted. Retrying FK statement...');
      // Retry original statement
      try {
        await sequelize.query(f.statement);
        console.log('FK statement applied successfully for', childTable);
      } catch (err2) {
        console.error('Retry failed:', err2.message || err2);
      }
    } catch (err) {
      console.error('Error processing failed alter:', err.message || err);
    }
  }

  console.log('\nFinished processing failed ALTERs.');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
