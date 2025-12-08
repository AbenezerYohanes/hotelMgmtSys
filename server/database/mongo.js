// MongoDB support has been removed in favor of MySQL/Sequelize.
// This file kept as a stub to fail fast if still imported anywhere.
module.exports = {
  connect: async () => {
    throw new Error('MongoDB has been removed. Use Sequelize (server/config/db.js) and MySQL instead.');
  }
};