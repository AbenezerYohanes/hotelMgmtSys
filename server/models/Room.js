module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    room_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    floor: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
    hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    room_type_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    status: { type: DataTypes.ENUM('available','occupied','maintenance','cleaning'), defaultValue: 'available' },
    is_clean: { type: DataTypes.BOOLEAN, defaultValue: true },
    amenities: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue('amenities');
        try { return raw ? JSON.parse(raw) : []; } catch (e) { return [] }
      },
      set(val) {
        this.setDataValue('amenities', val ? JSON.stringify(val) : JSON.stringify([]));
      }
    },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'rooms',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Room;
};
