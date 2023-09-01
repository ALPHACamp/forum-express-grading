'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Category.hasMany(models.Restaurant, { foreignKey: 'categoryId' }) // 新增這裡
    }
  };
  Category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories', // 別忘了這行
    underscored: true
  })
  return Category
}
