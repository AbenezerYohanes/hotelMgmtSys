const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: __dirname + '/../.env' });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'hotel_management';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
  define: {
    underscored: true,
    freezeTableName: false,
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require('../models/User')(sequelize, DataTypes);
db.RoomType = require('../models/RoomType')(sequelize, DataTypes);
db.Room = require('../models/Room')(sequelize, DataTypes);
db.Payment = require('../models/Payment')(sequelize, DataTypes);
db.Hotel = require('../models/Hotel')(sequelize, DataTypes);
db.Guest = require('../models/Guest')(sequelize, DataTypes);
db.Employee = require('../models/Employee')(sequelize, DataTypes);
db.Department = require('../models/Department')(sequelize, DataTypes);
db.Booking = require('../models/Booking')(sequelize, DataTypes);

// Associations
// User <-> Booking
db.User.hasMany(db.Booking, { foreignKey: 'user_id', as: 'bookings' });
db.Booking.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });

// Guest <-> Booking
db.Guest.hasMany(db.Booking, { foreignKey: 'guest_id', as: 'bookings' });
db.Booking.belongsTo(db.Guest, { foreignKey: 'guest_id', as: 'guest' });

// RoomType <-> Room
db.RoomType.hasMany(db.Room, { foreignKey: 'room_type_id', as: 'rooms', constraints: false });
db.Room.belongsTo(db.RoomType, { foreignKey: 'room_type_id', as: 'room_type', constraints: false });

// Room <-> Booking
db.Room.hasMany(db.Booking, { foreignKey: 'room_id', as: 'bookings', constraints: false });
db.Booking.belongsTo(db.Room, { foreignKey: 'room_id', as: 'room', constraints: false });

// Booking <-> Payment
db.Booking.hasMany(db.Payment, { foreignKey: 'booking_id', as: 'payments', constraints: false });
db.Payment.belongsTo(db.Booking, { foreignKey: 'booking_id', as: 'booking', constraints: false });

// Department <-> Employee
db.Department.hasMany(db.Employee, { foreignKey: 'department_id', as: 'employees', constraints: false });
db.Employee.belongsTo(db.Department, { foreignKey: 'department_id', as: 'department', constraints: false });

// User <-> Employee
db.User.hasOne(db.Employee, { foreignKey: 'user_id', as: 'employee', constraints: false });
db.Employee.belongsTo(db.User, { foreignKey: 'user_id', as: 'user', constraints: false });

// Hotel <-> Room
db.Hotel.hasMany(db.Room, { foreignKey: 'hotel_id', as: 'rooms', constraints: false });
db.Room.belongsTo(db.Hotel, { foreignKey: 'hotel_id', as: 'hotel', constraints: false });

module.exports = db;
