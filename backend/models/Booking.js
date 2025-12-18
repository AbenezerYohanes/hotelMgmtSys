const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    guestId: { type: DataTypes.INTEGER },
    roomId: { type: DataTypes.INTEGER },
    checkIn: { type: DataTypes.DATE, allowNull: false },
    checkOut: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('reserved','checked_in','checked_out','cancelled'), defaultValue: 'reserved' },
    total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 }
  }, { tableName: 'Bookings' });
  return Booking;
};
