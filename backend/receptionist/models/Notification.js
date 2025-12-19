const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID },
    type: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
    read: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'notifications', timestamps: true });
};
