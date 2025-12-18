const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bookingId: { type: DataTypes.INTEGER },
    method: { type: DataTypes.STRING },
    amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('pending','paid','failed','refunded'), defaultValue: 'pending' },
    meta: { type: DataTypes.JSON }
  }, { tableName: 'Payments' });
  return Payment;
};
