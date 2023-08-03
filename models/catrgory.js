'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Catrgory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Catrgory.hasMany(models.Restaurant, { foreignKey: 'categoryId' })
    }
  };
  Catrgory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Catrgory',
    underscored: true
  })
  return Catrgory
}
