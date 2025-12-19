module.exports = (sequelize, DataTypes) => {
  const StaffSchedule = sequelize.define('StaffSchedule', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    staffId: { type: DataTypes.INTEGER },
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false },
    role: { type: DataTypes.STRING }
  }, { timestamps: true });

  return StaffSchedule;
};
