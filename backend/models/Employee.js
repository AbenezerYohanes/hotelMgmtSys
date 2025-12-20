module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Employee', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        hotel_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
        first_name: { type: DataTypes.STRING(150), allowNull: false },
        last_name: { type: DataTypes.STRING(150), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false },
        contact: { type: DataTypes.STRING(50), allowNull: true },
        address: { type: DataTypes.TEXT, allowNull: true },
        role_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        working_year: { type: DataTypes.INTEGER, defaultValue: 0 },
        total_working_year: { type: DataTypes.INTEGER, defaultValue: 0 },
        status: { 
            type: DataTypes.ENUM('active', 'inactive', 'terminated'), 
            defaultValue: 'active' 
        },
        picture: { type: DataTypes.STRING(500), allowNull: true }
    }, { tableName: 'employees', timestamps: true });
};
