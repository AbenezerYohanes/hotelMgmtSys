module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Attendance', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        date: { type: DataTypes.DATEONLY, allowNull: false },
        clock_in: { type: DataTypes.DATE, allowNull: true },
        clock_out: { type: DataTypes.DATE, allowNull: true },
        status: { 
            type: DataTypes.ENUM('present', 'absent', 'late', 'on_leave'), 
            defaultValue: 'absent' 
        }
    }, { tableName: 'attendance', timestamps: true });
};

