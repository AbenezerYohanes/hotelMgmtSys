module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Department', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        hotel_id: { type: DataTypes.INTEGER }
    }, { tableName: 'departments', timestamps: true });
};
