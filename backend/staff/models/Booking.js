module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    reference: { type: DataTypes.STRING, allowNull: false },
    guestName: { type: DataTypes.STRING, allowNull: false },
    roomId: { type: DataTypes.INTEGER },
    cabinId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('assigned','checked-in','checked-out','cleaning-required','cancelled'), defaultValue: 'assigned' },
    notes: { type: DataTypes.TEXT },
    staffId: { type: DataTypes.INTEGER }
  }, { timestamps: true });

  return Booking;
};
