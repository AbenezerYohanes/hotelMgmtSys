const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StaffSchedule = sequelize.define('StaffSchedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    staffId: { type: DataTypes.INTEGER },
    shiftStart: { type: DataTypes.DATE },
    shiftEnd: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('scheduled','completed','missed'), defaultValue: 'scheduled' }
  }, { tableName: 'StaffSchedules' });
  return StaffSchedule;
};
