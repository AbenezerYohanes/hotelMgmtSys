module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Hotel', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        location: { type: DataTypes.STRING },
        contact: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING }
    }, { tableName: 'hotels', timestamps: true });
};
