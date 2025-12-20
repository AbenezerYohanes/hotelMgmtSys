module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Guest', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING },
        last_name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING, unique: true },
        password: { type: DataTypes.STRING },
        contact: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING }
    }, { tableName: 'guests', timestamps: true });
};
