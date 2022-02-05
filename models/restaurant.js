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

      Restaurant.hasMany(models.Comment, { foreignKey: 'restaurantId' })
    }
  };
  Restaurant.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    openingHours: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurant
}
