'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
<<<<<<< Updated upstream
      Category.hasMany(models.Restaurant, { foreignKey: 'categoryId' }) // 要指定名稱
=======
      Category.hasMany(models.Restaurant, { foreignKey: 'restaurantId' }) // 要指定名稱
>>>>>>> Stashed changes
    }
  };
  Category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    underscored: true
  })
  return Category
}
