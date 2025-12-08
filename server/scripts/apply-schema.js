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
    const conn = await mysql.createConnection({ host, user, password, port, multipleStatements: true });
    await conn.query(sql);
    console.log('✅ Schema applied successfully');
    await conn.end();
  } catch (err) {
    console.error('❌ Failed to apply schema:', err.message);
    process.exit(1);
  }
})();
