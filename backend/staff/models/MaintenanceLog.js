module.exports = (sequelize, DataTypes) => {
  const MaintenanceLog = sequelize.define('MaintenanceLog', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    locationType: { type: DataTypes.ENUM('room','cabin','other'), defaultValue: 'room' },
    locationId: { type: DataTypes.INTEGER },
    description: { type: DataTypes.TEXT },
    priority: { type: DataTypes.ENUM('low','medium','high'), defaultValue: 'medium' },
    status: { type: DataTypes.ENUM('reported','in-progress','resolved'), defaultValue: 'reported' },
    reportedBy: { type: DataTypes.INTEGER }
  }, { timestamps: true });

  return MaintenanceLog;
};
