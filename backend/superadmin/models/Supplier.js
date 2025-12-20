const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    contact: { type: DataTypes.JSON }
  }, { paranoid: true });
};
