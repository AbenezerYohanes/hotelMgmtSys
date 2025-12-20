const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    bookingId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
    status: { type: DataTypes.ENUM('pending','success','failed','refunded'), defaultValue: 'pending' },
    provider: { type: DataTypes.STRING(100) },
    metadata: { type: DataTypes.JSON }
  }, { timestamps: true });
};
