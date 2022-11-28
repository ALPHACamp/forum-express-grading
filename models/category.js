// npx sequelize model:generate --name Category --attributes name:string --underscored
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
      // define association here
      Category.hasMany(models.Restaurant, { foreignKey: 'categoryId' }) // 會自動生成CategoryId，但我們要改成小寫駝峰
    }
  }
  Category.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'Categories', // 別忘了這行
      underscored: true
    }
  )
  return Category
}
