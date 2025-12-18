module.exports = (sequelize) => {
  const User = require('./User')(sequelize);
  const Room = require('./Room')(sequelize);
  const Booking = require('./Booking')(sequelize);
  const Payment = require('./Payment')(sequelize);
  const Pricing = require('./Pricing')(sequelize);
  const Notification = require('./Notification')(sequelize);
  const Inventory = require('./Inventory')(sequelize);
  const StaffSchedule = require('./StaffSchedule')(sequelize);

  // Associations
  User.hasMany(Booking, { foreignKey: 'guestId' });
  Booking.belongsTo(User, { as: 'guest', foreignKey: 'guestId' });

  Room.hasMany(Booking, { foreignKey: 'roomId' });
  Booking.belongsTo(Room, { foreignKey: 'roomId' });

  Booking.hasOne(Payment, { foreignKey: 'bookingId' });
  Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

  User.hasMany(Notification, { foreignKey: 'userId' });
  Notification.belongsTo(User, { foreignKey: 'userId' });

  return { User, Room, Booking, Payment, Pricing, Notification, Inventory, StaffSchedule };
};
