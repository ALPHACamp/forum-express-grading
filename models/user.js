'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN // 寫小駝峰式 isAdmin 就可以了，因為這邊是純 JavaScript 實作
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 避免 Travis 找不到資料表
    underscored: true
  })
  return User
}
