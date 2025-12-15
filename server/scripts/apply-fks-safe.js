const fs = require('fs');
const path = require('path');
const db = require('../config/db');

function splitStatements(sql) {
  // naive split on semicolon followed by newline or end; keeps statements intact
  return sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function main() {
  const sqlPath = path.join(__dirname, '..', 'db', 'schema-fks.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('schema-fks.sql not found at', sqlPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(sqlPath, 'utf8');
  const statements = splitStatements(raw);

  // connect
  try {
    await db.connect();
  } catch (err) {
    console.error('Unable to connect to DB:', err.message || err);
    process.exit(1);
  }

  const sequelize = db.sequelize;

  // Determine tables that will be altered
  const alterRegex = /ALTER\s+TABLE\s+`?([a-zA-Z0-9_]+)`?/i;
  const affectedTables = new Set();
  for (const s of statements) {
    const m = s.match(alterRegex);
    if (m) affectedTables.add(m[1]);
  }

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backups = [];

  // Create backups for affected tables
  for (const tbl of affectedTables) {
    const backupName = `${tbl}_backup_${ts}`;
    try {
      console.log(`Creating backup table ${backupName} ...`);
      await sequelize.query(`CREATE TABLE IF NOT EXISTS \`${backupName}\` LIKE \`${tbl}\``);
      await sequelize.query(`INSERT INTO \`${backupName}\` SELECT * FROM \`${tbl}\``);
      backups.push({ table: tbl, backup: backupName, ok: true });
    } catch (err) {
      console.error(`Failed to backup table ${tbl}:`, err.message || err);
      backups.push({ table: tbl, backup: backupName, ok: false, error: err.message || String(err) });
    }
  }

  const results = [];

  // Execute statements sequentially
  for (const s of statements) {
    try {
      console.log('Executing:', s.split('\n')[0].slice(0,200));
      const res = await sequelize.query(s);
      results.push({ statement: s, ok: true });
    } catch (err) {
      console.error('Statement failed:', err.message || err);
      results.push({ statement: s, ok: false, error: err.message || String(err) });
      // continue with remaining statements
    }
  }

  // Write log
  const log = { timestamp: ts, backups, results };
  const outPath = path.join(__dirname, '..', 'db', `fk-apply-log-${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(log, null, 2), 'utf8');
  console.log('Done. Log written to', outPath);
  process.exit(0);
}

main().catch(err => {
  console.error('Unexpected error:', err.message || err);
  process.exit(1);
});
