'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Restaurants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurants.belongsTo(models.Category, { foreignKey: 'categoryId' }) //  定義與category的關連
    }
  };
  Restaurants.init({
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    openingHour: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'Restaurants',
    underscored: true
  })
  return Restaurants
}
