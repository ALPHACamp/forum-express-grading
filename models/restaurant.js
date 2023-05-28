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
    static associate(models) {
      // define association here
      Restaurant.belongsTo(models.Category, { foreignKey: 'categoryId' }) // 設定單方與category關聯，並設定categoryId為外鍵
      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' }) // 多個Comment FK:restaurantId
      // Favorite
      Restaurant.belongsToMany(models.User, { // 多對多設定
        through: models.Favorite, // 透過多對多對照表Favorite表來建立關聯
        foreignKey: 'restaurantId', // 對 Favorite 表設定 FK
        as: 'FavoritedUsers' // 幫這個關聯取個名稱
      })
      // Like
      Restaurant.belongsToMany(models.User, { // 多對多設定
        through: models.Like, // 透過多對多對照表Like表來建立關聯
        foreignKey: 'restaurantId', // 對 Like 表設定 FK
        as: 'LikedUsers' // 幫這個關聯取個名稱
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
