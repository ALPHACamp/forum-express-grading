'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // 評論 - 一對多關聯 - 使用者有很多評論
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      // 收藏 - 多對多關聯 - 餐廳有很多收藏者
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'userId',
        as: 'FavoritedRestaurants'
      })
      // like - 多對多關聯 - 餐廳有很多按 like 的使用者
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
