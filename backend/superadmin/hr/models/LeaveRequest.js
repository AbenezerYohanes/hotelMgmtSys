const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    days: { type: DataTypes.FLOAT, defaultValue: 0 },
    reason: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('pending','approved','rejected'), defaultValue: 'pending' },
    approverId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'leave_requests',
    paranoid: true,
    indexes: [{ fields: ['employeeId'] }, { fields: ['status'] }]
  });

  return LeaveRequest;
};
