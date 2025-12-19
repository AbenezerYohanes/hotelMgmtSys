const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    method: { type: DataTypes.ENUM('cash','card','bank_transfer'), allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    metadata: { type: DataTypes.JSON }
  }, {
    tableName: 'payments',
    timestamps: true
  });
};
