// MongoDB connection helper removed. Use `server/config/db.js` (Sequelize) for MySQL connection.
module.exports = () => {
  throw new Error('MongoDB connection helper removed. Use Sequelize in server/config/db.js');
};