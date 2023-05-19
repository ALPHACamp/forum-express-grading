'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {}
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN //* 新加入，這行跟underscored有連動
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // todo  新增
    underscored: true
  })
  return User
}
