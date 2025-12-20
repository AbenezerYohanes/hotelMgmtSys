const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payroll = sequelize.define('Payroll', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    periodStart: { type: DataTypes.DATEONLY },
    periodEnd: { type: DataTypes.DATEONLY },
    gross: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    net: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('draft','processed','paid'), defaultValue: 'draft' },
    meta: { type: DataTypes.JSON }
  }, {
    tableName: 'payroll',
    paranoid: true,
    indexes: [{ fields: ['employeeId'] }, { fields: ['status'] }]
  });

  return Payroll;
};