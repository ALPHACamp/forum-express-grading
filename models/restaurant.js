'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate (models) {
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'restaurantId', // Favorite 表的FK，表示會在 Favorite 表上找 restaurant_id = restaurant.id 的紀錄
        as: 'FavoritedUsers' // 此關聯的名稱，之後用 Restaurant.FavoritedUsers 抓出 users
      })
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'restaurantId', // Favorite 表的FK，表示會在 Favorite 表上找 restaurant_id = restaurant.id 的紀錄
        as: 'LikedUsers' // 此關聯的名稱，之後用 Restaurant.FavoritedUsers 抓出 users
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
