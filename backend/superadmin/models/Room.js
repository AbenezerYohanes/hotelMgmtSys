const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Room', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    cabinId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    number: { type: DataTypes.STRING(50), allowNull: false },
    type: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.ENUM('available','occupied','maintenance'), defaultValue: 'available' },
    price: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    amenities: { type: DataTypes.JSON }
  }, { paranoid: true });
};
