const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const FK_FILE = path.join(__dirname, '..', 'db', 'schema-fks.sql');
const LOG_DIR = path.join(__dirname, '..', 'logs');
const ensureDir = d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };
ensureDir(LOG_DIR);

function splitStatements(sql) {
  return sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
}

function parseAlterInfo(stmt) {
  const mTable = stmt.match(/ALTER\s+TABLE\s+`?(\w+)`?/i);
  const mConstr = stmt.match(/ADD\s+CONSTRAINT\s+`?(\w+)`?/i);
  return { table: mTable ? mTable[1] : null, constraint: mConstr ? mConstr[1] : null, stmt };
}

async function run() {
  const raw = fs.readFileSync(FK_FILE, 'utf8');
  const statements = splitStatements(raw);
  try { await db.connect(); } catch (err) { console.error('DB connect failed:', err.message); process.exit(1); }
  const sequelize = db.sequelize;
  const results = [];
  for (const s of statements) {
    const info = parseAlterInfo(s);
    const logItem = { info, ok: false, error: null };
    if (!info.table) { logItem.error = 'Could not parse child table'; results.push(logItem); continue; }
    // If constraint name exists, attempt DROP FOREIGN KEY (ignore errors)
    if (info.constraint) {
      try {
        await sequelize.query(`ALTER TABLE \`${info.table}\` DROP FOREIGN KEY \`${info.constraint}\``);
        console.log(`Dropped existing FK ${info.constraint} on ${info.table}`);
      } catch (e) {
        console.log(`No existing FK ${info.constraint} to drop (or drop failed):`, e.message);
      }
      // Also try drop index with same name (some MySQL versions create index)
      try {
        await sequelize.query(`ALTER TABLE \`${info.table}\` DROP INDEX \`${info.constraint}\``);
        console.log(`Dropped existing index ${info.constraint} on ${info.table}`);
      } catch (e) {
        // ignore
      }
    }
    // Now try to apply original statement
    try {
      await sequelize.query(s);
      logItem.ok = true;
      console.log('Applied:', s.split('\n')[0]);
    } catch (err) {
      logItem.error = String(err.message || err);
      console.error('Failed to apply:', s.split('\n')[0], err.message || err);
    }
    results.push(logItem);
  }
  const out = path.join(LOG_DIR, `reapply-fks-${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log('Done. Log:', out);
}

run().catch(err => { console.error('Unexpected:', err); process.exit(1); });
