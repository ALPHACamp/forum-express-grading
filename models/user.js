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
      // define association here
      // hasMany() 是1對多關係
      User.hasMany(models.Comment, { foreignKey: 'userId' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 新增這裡
    underscored: true
  })
  return User
}

// model資料是純 JavaScript 實作，以js小駝峰式寫法命名就可以
// underscored 副指令會在操作資料庫的時候，幫我們把 JavaScript 這邊的命名自動轉成 snake case 的欄位名稱 is_admin
