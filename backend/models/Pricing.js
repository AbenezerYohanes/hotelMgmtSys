const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pricing = sequelize.define('Pricing', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    adjustmentType: { type: DataTypes.ENUM('percent','fixed'), defaultValue: 'percent' },
    adjustmentValue: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 }
  }, { tableName: 'Pricing' });
  return Pricing;
};
