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
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true // underscored: Sequelize 就能夠幫忙把 lowerCamelCase 和 snack_case 的變數自動做雙向轉換
    // 寫 JavaScript 操作 Sequelize ORM 處理資料時，會用 lowerCamelCase
    // 直接對資料庫操作時，需要寫 snack_case
  })
  return User
}
