module.exports = (sequelize, DataTypes) => {
    return sequelize.define('LeaveRequest', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        start_date: { type: DataTypes.DATEONLY, allowNull: false },
        end_date: { type: DataTypes.DATEONLY, allowNull: false },
        type: { 
            type: DataTypes.ENUM('sick', 'vacation', 'personal', 'other'), 
            defaultValue: 'personal' 
        },
        status: { 
            type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
            defaultValue: 'pending' 
        },
        reason: { type: DataTypes.TEXT, allowNull: true }
    }, { tableName: 'leave_requests', timestamps: true });
};

