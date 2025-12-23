module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Reservation', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        guest_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        room_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: false },
        status: { 
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'), 
            defaultValue: 'pending' 
        },
        total_price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
    }, { tableName: 'reservations', timestamps: true });
};
