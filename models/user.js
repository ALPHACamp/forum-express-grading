'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'userId', // Favorite 表的FK，表示會在 Favorite 表上找 user_id = user.id 的紀錄
        as: 'FavoritedRestaurants' // 此關聯的名稱，之後用 Restaurant.FavoritedRestaurants 抓出 restaurants
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId', // 自己的id要出現在followingId欄位
        as: 'Followers' // 此關係叫做(my)Followers -> User.Followers -> 取出在follow自己的人
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId', // 自己的id要出現在followerId欄位
        as: 'Followings' // 此關係叫做(my)Followings -> User.Followings -> 取出在自己follow的人
      })
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
