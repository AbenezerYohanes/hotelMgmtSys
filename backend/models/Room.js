module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Room', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    room_type: { type: DataTypes.STRING(100), allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: true },
    capacity: { type: DataTypes.INTEGER, defaultValue: 1 },
    amenities: { type: DataTypes.JSON, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    status: { 
      type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'cleaning'), 
      defaultValue: 'available' 
    }
  }, { tableName: 'rooms', timestamps: true });
};
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, unique: true },
    type: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER, defaultValue: 2 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    amenities: { type: DataTypes.JSON, allowNull: true },
    status: { type: DataTypes.ENUM('available', 'occupied', 'maintenance'), defaultValue: 'available' }
  }, { tableName: 'Rooms' });
  return Room;
};
