module.exports = (sequelize, DataTypes) => {
  const GuestRequest = sequelize.define('GuestRequest', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER },
    guestName: { type: DataTypes.STRING },
    requestType: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('open','in-progress','completed'), defaultValue: 'open' },
    handledBy: { type: DataTypes.INTEGER }
  }, { timestamps: true });

  return GuestRequest;
};
