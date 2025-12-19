const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    reference: { type: DataTypes.STRING, allowNull: false, unique: true },
    guestId: { type: DataTypes.UUID, allowNull: false },
    roomId: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('reserved','checked_in','checked_out','cancelled'), defaultValue: 'reserved' },
    checkInDate: { type: DataTypes.DATE, allowNull: false },
    checkOutDate: { type: DataTypes.DATE, allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    cancelledAt: { type: DataTypes.DATE }
  }, {
    tableName: 'bookings',
    timestamps: true,
    paranoid: true
  });
};
