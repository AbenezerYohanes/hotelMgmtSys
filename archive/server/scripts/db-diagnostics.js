#!/usr/bin/env node
// Run a set of diagnostics against the configured MySQL/MariaDB database
// Usage: DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD= DB_NAME=hotel_management node server/scripts/db-diagnostics.js
const mysql = require('mysql2/promise');

(async function main(){
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'hotel_management';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  console.log('DB diagnostics connecting to', { host, user, database, port });

  let conn;
  try {
    conn = await mysql.createConnection({ host, user, password, port, multipleStatements: true });

    // Basic server info
    const [verRows] = await conn.query('SELECT VERSION() AS version');
    console.log('\n--- SERVER VERSION ---\n', verRows[0]);

    const [lowerRows] = await conn.query("SHOW VARIABLES LIKE 'lower_case_table_names'");
    console.log('\n--- lower_case_table_names ---\n', lowerRows);

    // Ensure database exists / select it
    try {
      await conn.query(`USE \`${database}\``);
    } catch (useErr) {
      console.error(`\nERROR selecting database ${database}:`, useErr.message || useErr);
      // still continue to attempt listing
    }

    // List tables in the database
    try {
      const [tables] = await conn.query(`SHOW TABLES IN \`${database}\``);
      console.log('\n--- TABLES IN ' + database + ' ---\n', tables.map(r => Object.values(r)[0]));
    } catch (tErr) {
      console.error('\nFailed to list tables:', tErr.message || tErr);
    }

    // Tables of interest
    const targets = ['users','departments','employees','hotels','rooms','guests','bookings','payments','attendance','chapa_transactions','payroll','price_tracking'];
    for (const tbl of targets) {
      try {
        const [rows] = await conn.query(`SHOW CREATE TABLE \`${database}\`.\`${tbl}\``);
        console.log(`\n--- SHOW CREATE TABLE ${tbl} ---`);
        console.log(rows[0]['Create Table']);
      } catch (err) {
        console.log(`\n--- SHOW CREATE TABLE ${tbl} ---`);
        console.log(`(not found) ${err.code || ''} ${err.message || err}`);
      }
    }

    // InnoDB status
    try {
      const [inn] = await conn.query('SHOW ENGINE INNODB STATUS');
      console.log('\n--- INNODB STATUS (truncated to last 4000 chars) ---');
      const statusText = inn && inn[0] && (inn[0].Status || inn[0].Message || JSON.stringify(inn[0]));
      console.log(statusText ? statusText.slice(-4000) : statusText);
    } catch (innErr) {
      console.error('\nFailed to fetch InnoDB status:', innErr.message || innErr);
    }

    // Key usage (foreign keys)
    try {
      const [fkRows] = await conn.query(
        `SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL`, [database]
      );
      console.log('\n--- FOREIGN KEY USAGE in ' + database + ' ---\n', fkRows);
    } catch (fkErr) {
      console.error('\nFailed to query information_schema.KEY_COLUMN_USAGE:', fkErr.message || fkErr);
    }

    console.log('\nDiagnostics complete.');

  } catch (err) {
    console.error('\nFatal error while running diagnostics:', err);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
  }

})();
