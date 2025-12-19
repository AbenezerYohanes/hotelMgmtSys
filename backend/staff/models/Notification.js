module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    staffId: { type: DataTypes.INTEGER },
    message: { type: DataTypes.STRING },
    priority: { type: DataTypes.ENUM('low','medium','high'), defaultValue: 'low' },
    read: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { timestamps: true });

  return Notification;
};
