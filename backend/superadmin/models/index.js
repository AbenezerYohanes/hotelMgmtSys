const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const PricingRule = require('./PricingRule')(sequelize);
const PricingHistory = require('./PricingHistory')(sequelize);
const Cabin = require('./Cabin')(sequelize);
const Room = require('./Room')(sequelize);
const Booking = require('./Booking')(sequelize);
const Payment = require('./Payment')(sequelize);
const Inventory = require('./Inventory')(sequelize);
const Supplier = require('./Supplier')(sequelize);
const Notification = require('./Notification')(sequelize);
const SystemSetting = require('./SystemSetting')(sequelize);

// Associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Cabin.hasMany(Room, { foreignKey: 'cabinId' });
Room.belongsTo(Cabin, { foreignKey: 'cabinId' });

PricingRule.hasMany(PricingHistory, { foreignKey: 'ruleId' });
PricingHistory.belongsTo(PricingRule, { foreignKey: 'ruleId' });

Supplier.hasMany(Inventory, { foreignKey: 'supplierId' });
Inventory.belongsTo(Supplier, { foreignKey: 'supplierId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  PricingRule,
  PricingHistory,
  Cabin,
  Room,
  Booking,
  Payment,
  Inventory,
  Supplier,
  Notification,
  SystemSetting
};
