module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Reservation', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        guest_id: { type: DataTypes.INTEGER },
        room_id: { type: DataTypes.INTEGER },
        start_date: { type: DataTypes.DATEONLY },
        end_date: { type: DataTypes.DATEONLY },
        status: { type: DataTypes.STRING, defaultValue: 'pending' },
        total_price: { type: DataTypes.DECIMAL(10, 2) }
    }, { tableName: 'reservations', timestamps: true });
};
