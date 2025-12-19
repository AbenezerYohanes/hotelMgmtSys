module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    number: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    capacity: { type: DataTypes.INTEGER, defaultValue: 2 },
    amenities: { type: DataTypes.JSON },
    status: { type: DataTypes.ENUM('available','occupied','cleaning','maintenance'), defaultValue: 'available' }
  });

  return Room;
};
