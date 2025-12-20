const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('PricingHistory', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ruleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    oldPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    newPrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    changedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    reason: { type: DataTypes.STRING(500) }
  }, { timestamps: true });
};
