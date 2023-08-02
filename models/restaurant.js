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
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
    viewCounts: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants', // 自己新增這一行
    paranoid: true, // 啟動soft delete
    underscored: true
  })
  return Restaurant
}
