const db = require('../config/db');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection authenticated.');
    await db.sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to sync database:', err);
    process.exit(1);
  }
})();
