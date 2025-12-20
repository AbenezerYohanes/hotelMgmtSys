const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PricingRule', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    type: { type: DataTypes.ENUM('seasonal','weekend','holiday','demand'), allowNull: false },
    config: { type: DataTypes.JSON, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { paranoid: true });
};
