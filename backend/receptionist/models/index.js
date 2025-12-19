const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Guest = require('./Guest')(sequelize);
const Room = require('./Room')(sequelize);
const Booking = require('./Booking')(sequelize);
const Payment = require('./Payment')(sequelize);
const Invoice = require('./Invoice')(sequelize);
const Notification = require('./Notification')(sequelize);

// Associations
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Guest.hasMany(Booking, { foreignKey: 'guestId' });
Booking.belongsTo(Guest, { foreignKey: 'guestId' });

Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

Booking.hasMany(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

Booking.hasOne(Invoice, { foreignKey: 'bookingId' });
Invoice.belongsTo(Booking, { foreignKey: 'bookingId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Guest,
  Room,
  Booking,
  Payment,
  Invoice,
  Notification
};
