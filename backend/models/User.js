const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('superadmin','admin','staff','receptionist','guest'), defaultValue: 'guest' },
    meta: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      }
    }
  });

  User.prototype.validatePassword = function (pw) {
    return bcrypt.compare(pw, this.password);
  };

  return User;
};
