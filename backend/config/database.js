const { Sequelize } = require('sequelize');
const path = require('path');

const createSequelize = (opts) => new Sequelize(opts);

const initDb = async () => {
  // Try MySQL first (production-like). If it fails, fall back to SQLite for local demo/testing.
  const mysqlOpts = {
    database: process.env.DB_NAME || 'hotel_management',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  };

  let sequelize;
  // Allow forcing SQLite for local/testing via env var
  if (process.env.DB_FORCE_SQLITE === 'true') {
    sequelize = new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, '..', 'dev.sqlite'), logging: false });
  } else {
    try {
      sequelize = new Sequelize(mysqlOpts.database, mysqlOpts.username, mysqlOpts.password, mysqlOpts);
      await sequelize.authenticate();
    } catch (err) {
      console.warn('MySQL connection failed — falling back to SQLite for local demo.', err.message);
      // Use file-based SQLite so data persists across runs during development
      sequelize = new Sequelize({ dialect: 'sqlite', storage: path.join(__dirname, '..', 'dev.sqlite'), logging: false });
    }
  }

  // load models
  const models = require(path.join(__dirname, '..', 'models'))(sequelize);

  // run associations if any
  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') model.associate(models);
  });

  await sequelize.sync();
  return sequelize;
};

module.exports = { initDb };
