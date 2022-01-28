'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate (models) {
    }
  };
  Favorite.init({
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'Favorites',
    underscored: true
  })
  return Favorite
}
