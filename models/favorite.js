'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.Restaurant, { foreignKey: 'favorite_id' })
      Favorite.belongsTo(models.User, { foreignKey: user })
    }
  };
  Favorite.init({
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'Favorites', // 新增這裡
    underscored: true
  })
  return Favorite
}
