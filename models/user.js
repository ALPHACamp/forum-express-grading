'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Comment)
    }
  };
  User.init({
    name: DataTypes.STRING(20),
    email: DataTypes.STRING(127),
    password: DataTypes.STRING(20),
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.TEXT, 
    description: DataTypes.TEXT('tiny'), 
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: 'registeredAt'
  });
  return User;
};