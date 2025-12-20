const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    roomId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('pending','confirmed','cancelled','completed'), defaultValue: 'pending' }
  }, { paranoid: true });
};
