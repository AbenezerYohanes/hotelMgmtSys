const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PayrollItem = sequelize.define('PayrollItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    payrollId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('earning','deduction'), allowNull: false },
    amount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    description: { type: DataTypes.STRING }
  }, {
    tableName: 'payroll_items',
    paranoid: true,
    indexes: [{ fields: ['payrollId'] }]
  });

  return PayrollItem;
};