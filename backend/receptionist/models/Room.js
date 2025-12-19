const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    status: { type: DataTypes.ENUM('available','occupied','cleaning','maintenance'), defaultValue: 'available' }
  }, {
    tableName: 'rooms',
    timestamps: true
  });
};
