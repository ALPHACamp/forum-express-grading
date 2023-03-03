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
