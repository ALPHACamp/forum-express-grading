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
      Category.hasMany(models.Restaurant, { foreignKey: 'categoryId' })
      // (上1) 若不設 foreignKey，sequelize 會自動依 model name (Category) 設定一個 (CategoryId)，但想要命名方式更符合 JS 慣例，所以自己寫個 camelCase 版
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
