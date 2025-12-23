module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Shift', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        start_time: { type: DataTypes.TIME, allowNull: false },
        end_time: { type: DataTypes.TIME, allowNull: false }
    }, { tableName: 'shifts', timestamps: true });
};

