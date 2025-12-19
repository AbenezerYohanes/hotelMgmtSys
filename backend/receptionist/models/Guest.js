const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Guest', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    nationality: { type: DataTypes.STRING }
  }, {
    tableName: 'guests',
    timestamps: true
  });
};
