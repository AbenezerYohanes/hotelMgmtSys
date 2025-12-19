const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// define simple models to allow seed and basic operations
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Booking = require('./Booking')(sequelize, Sequelize.DataTypes);
db.Room = require('./Room')(sequelize, Sequelize.DataTypes);
db.Cabin = require('./Cabin')(sequelize, Sequelize.DataTypes);
db.GuestRequest = require('./GuestRequest')(sequelize, Sequelize.DataTypes);
db.MaintenanceLog = require('./MaintenanceLog')(sequelize, Sequelize.DataTypes);
db.StaffSchedule = require('./StaffSchedule')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Booking, { foreignKey: 'staffId' });
db.Booking.belongsTo(db.User, { foreignKey: 'staffId' });
db.User.hasMany(db.MaintenanceLog, { foreignKey: 'reportedBy' });
db.MaintenanceLog.belongsTo(db.User, { foreignKey: 'reportedBy' });
db.User.hasMany(db.StaffSchedule, { foreignKey: 'staffId' });
db.StaffSchedule.belongsTo(db.User, { foreignKey: 'staffId' });
db.User.hasMany(db.Notification, { foreignKey: 'staffId' });
db.Notification.belongsTo(db.User, { foreignKey: 'staffId' });

module.exports = db;
