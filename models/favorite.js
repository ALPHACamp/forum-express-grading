'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Favorite.init(
    {
      userId: DataTypes.INTEGER, // 改成小駝峰
      restaurantId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Favorite',
      tableName: 'Favorites', // 新增這裡
      underscored: true
    }
  )
  return Favorite
}
