const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const FK_FILE = path.join(__dirname, '..', 'db', 'schema-fks.sql');
const OUT_DIR = path.join(__dirname, '..', 'db', 'fk-backups');
const LOG_DIR = path.join(__dirname, '..', 'logs');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function timestamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

async function readFileSafe(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; }

async function dumpTableSample(table, outDir) {
  try {
    const rows = await db.sequelize.query(`SELECT * FROM \`${table}\` LIMIT 200`, { type: db.Sequelize.QueryTypes.SELECT });
    fs.writeFileSync(path.join(outDir, `${table}-sample.json`), JSON.stringify(rows, null, 2));
  } catch (err) {
    fs.writeFileSync(path.join(outDir, `${table}-sample-error.txt`), String(err));
  }
}

async function dumpCreate(table, outDir) {
  try {
    const raw = await db.sequelize.query(`SHOW CREATE TABLE \`${table}\``, { raw: true });
    fs.writeFileSync(path.join(outDir, `${table}-create.txt`), JSON.stringify(raw, null, 2));
  } catch (err) {
    fs.writeFileSync(path.join(outDir, `${table}-create-error.txt`), String(err));
  }
}

function extractTablesFromAlter(stmt) {
  const re = /ALTER\s+TABLE\s+`?(\w+)`?[\s\S]*?REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)/i;
  const m = stmt.match(re);
  if (m) return { child: m[1], parent: m[2], parentCol: m[3] };
  const re2 = /ALTER\s+TABLE\s+`?(\w+)`?/i;
  const m2 = stmt.match(re2);
  return m2 ? { child: m2[1] } : {};
}

async function apply() {
  ensureDir(OUT_DIR);
  ensureDir(LOG_DIR);
  const now = timestamp();
  const runDir = path.join(OUT_DIR, now);
  ensureDir(runDir);
  const logPath = path.join(LOG_DIR, `fk-apply-${now}.log`);

  const sql = await readFileSafe(FK_FILE);
  if (!sql) {
    console.error('No schema-fks.sql found at', FK_FILE);
    process.exit(1);
  }

  const parts = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);

  const summary = [];
  for (const stmt of parts) {
    if (!stmt) continue;
    const normalized = stmt.endsWith(';') ? stmt : stmt + ';';
    const info = extractTablesFromAlter(normalized);
    const stmtLog = { statement: normalized, info, status: 'pending', error: null };
    try {
      if (info.child) await dumpCreate(info.child, runDir);
      if (info.parent) await dumpCreate(info.parent, runDir);
      if (info.child) await dumpTableSample(info.child, runDir);
      if (info.parent) await dumpTableSample(info.parent, runDir);
    } catch (err) {
      console.warn('Backup warning for', info, err.message);
    }

    try {
      await db.sequelize.query(normalized);
      stmtLog.status = 'ok';
      console.log('OK:', normalized.split('\n')[0]);
    } catch (err) {
      stmtLog.status = 'error';
      stmtLog.error = { message: err.message, original: String(err) };
      console.error('FAILED:', normalized.split('\n')[0], err.message);
      const errFile = path.join(runDir, `error-${Math.random().toString(36).slice(2,8)}.json`);
      fs.writeFileSync(errFile, JSON.stringify({ statement: normalized, error: stmtLog.error }, null, 2));
    }
    summary.push(stmtLog);
    fs.appendFileSync(logPath, JSON.stringify(stmtLog) + '\n');
  }

  fs.writeFileSync(path.join(runDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log('Finished FK apply run. Log:', logPath, 'Backups:', runDir);
}

apply().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(2); });

