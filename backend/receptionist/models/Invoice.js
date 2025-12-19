const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Invoice', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookingId: { type: DataTypes.UUID, allowNull: false },
    issuedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    items: { type: DataTypes.JSON },
    total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 }
  }, {
    tableName: 'invoices',
    timestamps: true
  });
};
