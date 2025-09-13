const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE hotel_management');
    console.log('✅ Database "hotel_management" created or already exists.');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('✅ Database "hotel_management" already exists.');
    } else {
      console.error('❌ Error creating database:', error);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
