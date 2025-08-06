const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS hotel_management');
    console.log('✅ Database "hotel_management" created or already exists.');
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error);
  }
}

createDatabase();
