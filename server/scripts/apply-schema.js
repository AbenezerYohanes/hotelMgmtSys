#!/usr/bin/env node
// Apply server/db/schema.sql to MySQL using mysql2
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async function(){
  try {
    const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    const host = process.env.DB_HOST || '127.0.0.1';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

    console.log('Applying schema from', schemaPath);
    const database = process.env.DB_NAME || 'hotel_management';
    // Execute in phases: CREATE TABLEs, INSERTs, then ALTERs (FKs)
    const conn = await mysql.createConnection({ host, user, password, port, database, multipleStatements: true });
    const markerSeed = '-- Sample seed data';
    const markerAlters = '-- Add foreign key constraints after all tables are created';

    const idxSeed = sql.indexOf(markerSeed);
    const idxAlters = sql.indexOf(markerAlters);

    const createSql = idxSeed !== -1 ? sql.slice(0, idxSeed) : sql;
    const seedSql = (idxSeed !== -1 && idxAlters !== -1) ? sql.slice(idxSeed, idxAlters) : (idxSeed !== -1 ? sql.slice(idxSeed) : '');
    const altersSql = idxAlters !== -1 ? sql.slice(idxAlters) : '';

    try {
      if (createSql.trim()) {
        console.log('Running CREATE TABLE statements...');
        await conn.query(createSql);
      }
      if (seedSql.trim()) {
        console.log('Running seed INSERT statements...');
        await conn.query(seedSql);
      }
      if (altersSql.trim()) {
        console.log('Running ALTER TABLE (FK) statements...');
        await conn.query(altersSql);
      }

      console.log('✅ Schema applied successfully');
      await conn.end();
      return;
    } catch (phErr) {
      console.error('Phase execution failed, falling back to sequential execution. Error:');
      console.error(phErr);
    }

    // Final fallback: run statements sequentially and report failing statement
    const statements = sql
      .split(/;\s*\r?\n/)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        console.log(`Running statement ${i + 1}/${statements.length}: ${stmt.slice(0, 80).replace(/\n/g, ' ')}...`);
        await conn.query(stmt);
      } catch (stmtErr) {
        console.error(`Error executing statement ${i + 1}:`);
        console.error(stmt);
        throw stmtErr;
      }
    }

    console.log('✅ Schema applied successfully (sequential)');
    await conn.end();
  } catch (err) {
    console.error('❌ Failed to apply schema:');
    console.error(err);
    process.exit(1);
  }
})();
