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
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN // 這邊跟資料表剛創便不一樣，後續新增刪除都要自己手動修改 // 可以直接用駝峰的原因是：這邊是純 JS 操作，所以在 --underscored 管轄範圍
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  })
  return User
}
