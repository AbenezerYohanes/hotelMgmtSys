module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    booking_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: 'USD' },
    payment_method: { type: DataTypes.STRING, allowNull: true },
    payment_status: { type: DataTypes.STRING, defaultValue: 'pending' },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    metadata: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Payment;
};
