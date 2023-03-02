'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN // 寫小駝峰式 isAdmin 就可以了，因為這邊是純 JavaScript 實作
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })

  return User
}
