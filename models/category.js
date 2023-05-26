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
    static associate (models) {
      // define association here
      Category.hasMany(models.Restaurant, { foreignKey: 'categoryId' }) // 設定多方與models/restaurant關聯，並設定categoryId為外鍵
    }
  };
  Category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories', // 設定表格名稱
    underscored: true
  })
  return Category
}
