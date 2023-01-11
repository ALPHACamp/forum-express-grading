'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite, // 透過 Favorite 表來建立關聯
        foreignKey: 'userId', // 對 Favorite 表設定 FK，讓Sequelize 根據 user_id 這個欄位去找到關係
        as: 'FavoritedRestaurants' // 幫這個關聯取個名稱
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId', // 把現在的 user.id 對應到 Followship 裡的 followingId
        as: 'Followers' // 呼叫 user.Followers 方法時，根據這個別名找到這一組設定（也就是會找出在追蹤user的人）
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId', // 把現在的 user.id 對應到 Followship 裡的 followerId
        as: 'Followings' // 呼叫 user.Followers 方法時，根據這個別名找到這一組設定（也就是會找出user在追蹤的人）
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN, // 寫小駝峰式 isAdmin 就可以了，因為這邊是純 JavaScript 實作
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 避免 Travis 找不到資料表
    underscored: true
  })
  return User
}
