const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Inventory', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
    reorderThreshold: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 5 },
    supplierId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    meta: { type: DataTypes.JSON }
  }, { paranoid: true });
};
