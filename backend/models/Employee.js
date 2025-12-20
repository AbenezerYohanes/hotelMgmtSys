module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Employee', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        hotel_id: { type: DataTypes.INTEGER },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        contact: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        role_id: { type: DataTypes.INTEGER },
        working_year: { type: DataTypes.INTEGER },
        total_working_year: { type: DataTypes.INTEGER },
        status: { type: DataTypes.STRING, defaultValue: 'active' },
        picture: { type: DataTypes.STRING }
    }, { tableName: 'employees', timestamps: true });
};
