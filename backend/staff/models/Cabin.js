module.exports = (sequelize, DataTypes) => {
  const Cabin = sequelize.define('Cabin', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, defaultValue: 4 },
    amenities: { type: DataTypes.JSON },
    status: { type: DataTypes.ENUM('available','occupied','cleaning','maintenance'), defaultValue: 'available' }
  });

  return Cabin;
};
