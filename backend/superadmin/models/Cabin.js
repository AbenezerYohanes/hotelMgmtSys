const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Cabin', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    location: { type: DataTypes.STRING(255) },
    amenities: { type: DataTypes.JSON, allowNull: true },
    meta: { type: DataTypes.JSON }
  }, { paranoid: true });
};
