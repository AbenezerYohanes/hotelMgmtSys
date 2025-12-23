const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL Database Configuration for Render
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'hotel_hr_management';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = process.env.DB_PORT || 5432;

// Create Sequelize instance with PostgreSQL dialect
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 60000,  // 60 seconds
        idle: 10000
    },
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
    },
    retry: {
        max: 3  // Retry connection up to 3 times
    },
    // Use snake_case for timestamps to match database schema
    define: {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Initialize database connection
async function initDb() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ PostgreSQL Connected successfully');
        return sequelize;
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL database:', error.message);
        console.error('\n📝 Please ensure:');
        console.error('   1. PostgreSQL database is running');
        console.error('   2. Database "hotel_hr_management" exists');
        console.error('   3. PostgreSQL credentials in .env are correct');
        throw error;
    }
}

module.exports = { sequelize, initDb };
