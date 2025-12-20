const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    clockIn: { type: DataTypes.DATE, allowNull: true },
    clockOut: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM('present','absent','late'), defaultValue: 'present' },
    notes: { type: DataTypes.TEXT }
  }, {
    tableName: 'attendance',
    paranoid: true,
    indexes: [{ fields: ['employeeId'] }, { fields: ['date'] }]
  });

  return Attendance;
};