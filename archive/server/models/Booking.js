module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    booking_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    room_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    guest_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    check_in_date: { type: DataTypes.DATE, allowNull: false },
    check_out_date: { type: DataTypes.DATE, allowNull: false },
    adults: { type: DataTypes.INTEGER, defaultValue: 1 },
    children: { type: DataTypes.INTEGER, defaultValue: 0 },
    nights: { type: DataTypes.INTEGER, allowNull: true },
    total_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('pending','confirmed','cancelled','checked_in','checked_out'), defaultValue: 'pending' },
    special_requests: { type: DataTypes.TEXT, allowNull: true },
    stripe_payment_intent: { type: DataTypes.STRING, allowNull: true },
    payment_status: { type: DataTypes.ENUM('pending','succeeded','refunded'), defaultValue: 'pending' },
    receipt_url: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Booking;
};
