'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    static associate (models) {
      // 一個分類有多間餐廳
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })
      // 一間餐廳有多個評論
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })
      // 一間餐廳有多位收藏者，反之亦然
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'restaurantId',
        as: 'FavoritedUsers'
      })
      // 一間餐廳有多個 like 的使用者，反之亦然
      Restaurant.belongsToMany(models.User, {
        through: models.Like,
        foreignKey: 'restaurantId',
        as: 'LikedUsers'
      })
    }
  };
  Restaurant.init(
    {
      name: DataTypes.STRING,
      tel: DataTypes.STRING,
      address: DataTypes.STRING,
      openingHours: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      viewCounts: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Restaurant',
      tableName: 'Restaurants',
      underscored: true
    }
  )
  return Restaurant
}
