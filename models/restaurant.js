'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })

      // 設定多對多關係:在Favorite表中有兩個外鍵，分別是restaurant和user
      Restaurant.belongsToMany(models.User, {
        through: models.Favorite, // 透過Favorite設關聯
        foreignKey: 'restaurantId', // 對Favorite表設定外鍵
        as: 'FavoritedUsers' // 幫這個關聯取個名稱
      })

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
