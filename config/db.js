const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL Database Configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'hotel_hr_management';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = process.env.DB_PORT || 3306;

// Create Sequelize instance with MySQL dialect
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 60000,  // 60 seconds
        idle: 10000
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
        console.log('✅ MySQL Connected successfully');
        // return sequelize;
    } catch (error) {
        console.error('❌ Unable to connect to MySQL database:', error.message);
        console.error('\n📝 Please ensure:');
        console.error('   1. MySQL database is running');
        console.error('   2. Database "hotel_hr_management" exists');
        console.error('   3. MySQL credentials in .env are correct');
        throw error;
    }
}

module.exports = { sequelize, initDb };
