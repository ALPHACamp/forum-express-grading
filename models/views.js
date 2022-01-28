'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class View extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      View.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
      View.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  View.init({
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'View',
    tableName: 'Views',
    underscored: true
  })
  return View
}
