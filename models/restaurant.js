'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })
      // 多對多：餐廳有很多使用者收藏
      Restaurant.belongsToMany(models.User, { // 外鍵並不會直接做在 Restaurants
        through: models.Favorite, // 透過 Favorite 表來建立關聯
        foreignKey: 'restaurantId', // 對 Favorite 表設定 FK，讓Sequelize 根據 restaurant_id 這個欄位去找到關係
        as: 'FavoritedUsers' // 幫這個關聯取個名稱
      })
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'restaurantId',
        as: 'LikedUsers'
      })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
