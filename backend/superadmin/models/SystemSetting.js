const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('SystemSetting', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    key: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    value: { type: DataTypes.JSON, allowNull: true }
  }, { timestamps: true });
};
