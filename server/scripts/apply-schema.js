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

    // Execute CREATE DATABASE and USE first (if present)
    try {
      const createDbMatch = sql.match(/CREATE DATABASE [\s\S]*?;/i);
      if (createDbMatch) {
        console.log('Creating database...');
        await conn.query(createDbMatch[0]);
      }
      const useMatch = sql.match(/USE `?[A-Za-z0-9_]+`?\s*;/i);
      if (useMatch) {
        console.log('Selecting database...');
        await conn.query(useMatch[0]);
      }
    } catch (dbErr) {
      console.error('Failed to create/select database:', dbErr);
      throw dbErr;
    }

    // Extract CREATE TABLE blocks reliably using regex
    const createTableRegex = /CREATE\s+TABLE[\s\S]*?ENGINE=.*?;/gi;
    const createStatements = Array.from(sql.matchAll(createTableRegex)).map(m => m[0]);

    const idxSeed = sql.indexOf(markerSeed);
    const idxAlters = sql.indexOf(markerAlters);
    const seedSql = (idxSeed !== -1 && idxAlters !== -1) ? sql.slice(idxSeed, idxAlters) : (idxSeed !== -1 ? sql.slice(idxSeed) : '');
    const altersSql = idxAlters !== -1 ? sql.slice(idxAlters) : '';

    try {
      if (createStatements.length) {
        console.log(`Running ${createStatements.length} CREATE TABLE statements sequentially...`);
        for (let i = 0; i < createStatements.length; i++) {
          const stmt = createStatements[i];
          console.log(`CREATE stmt ${i + 1}/${createStatements.length}: ${stmt.split('\n')[0].slice(0,120)}...`);
          await conn.query(stmt);
        }
      } else {
        console.log('No CREATE TABLE statements found — running entire SQL as fallback.');
        await conn.query(sql);
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
      .replace(/--.*$/gm, '') // Remove -- comments
      .split(/;\s*\r?\n/)
      .map(s => s.trim())
      .filter(s => s);

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
