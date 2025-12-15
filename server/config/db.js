const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'hotel_management';
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
});

const db = { sequelize, Sequelize };

// Load models from server/models directory. Models export a function (sequelize, DataTypes) => Model
const modelsDir = path.join(__dirname, '..', 'models');
try {
  fs.readdirSync(modelsDir).forEach((file) => {
    if (!file.endsWith('.js')) return;
    const defineModel = require(path.join(modelsDir, file));
    if (typeof defineModel === 'function') {
      const model = defineModel(sequelize, DataTypes);
      db[model.name] = model;
    }
  });
} catch (err) {
  // If models folder is missing or unreadable, continue so app can still start
  console.warn('Warning: could not load models automatically from', modelsDir, err.message);
}

// Define associations (if models exist)
try {
  const { User, Hotel, Room, RoomType, Booking, Guest, Payment, Employee, Department } = db;
  if (User && Hotel) User.belongsTo(Hotel, { foreignKey: 'hotel_id' });
  if (Hotel && User) Hotel.hasMany(User, { foreignKey: 'hotel_id' });

  if (Room && RoomType) Room.belongsTo(RoomType, { foreignKey: 'room_type_id', as: 'room_type' });
  if (RoomType && Room) RoomType.hasMany(Room, { foreignKey: 'room_type_id', as: 'rooms' });

  if (Booking && Room) Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
  if (Booking && Guest) Booking.belongsTo(Guest, { foreignKey: 'guest_id', as: 'guest' });
  if (Booking && User) Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  if (Payment && Booking) Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

  if (Employee && Department) Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
} catch (e) {
  // ignore association errors at startup
}

async function connect(options = { sync: false }) {
  try {
    await sequelize.authenticate();
    if (options.sync) {
      await sequelize.sync({ alter: false });
    }
    console.log('✅ Connected to MySQL via Sequelize');
    return db;
  } catch (err) {
    console.error('❌ Sequelize connection error:', err.message);
    throw err;
  }
}

module.exports = Object.assign(db, { connect });
