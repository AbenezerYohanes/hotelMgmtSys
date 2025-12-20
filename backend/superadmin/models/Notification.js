const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    priority: { type: DataTypes.ENUM('low','medium','high','urgent'), defaultValue: 'low' },
    meta: { type: DataTypes.JSON }
  }, { timestamps: true });
};
