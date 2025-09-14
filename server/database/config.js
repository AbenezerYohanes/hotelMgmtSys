const { Pool } = require('pg');
const { logger } = require('../middleware/logger');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'hotel_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: parseInt(process.env.DB_CONNECTION_LIMIT) || 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info('✅ Connected to PostgreSQL database successfully', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
    client.release();
  } catch (err) {
    logger.error('❌ Error connecting to PostgreSQL database:', {
      error: err.message,
      code: err.code,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database
    });
    process.exit(1);
  }
};

// Initialize connection test
testConnection();

// Enhanced query function with better error handling
const query = async (text, params = []) => {
  try {
    const result = await pool.query(text, params);
    return { rows: result.rows, rowCount: result.rowCount };
  } catch (error) {
    logger.error('Database query error:', {
      query: text,
      params: params,
      error: error.message,
      code: error.code
    });
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check function
const healthCheck = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Closing database connections...');
  await pool.end();
  process.exit(0);
});

module.exports = {
  query,
  transaction,
  healthCheck,
  pool
};