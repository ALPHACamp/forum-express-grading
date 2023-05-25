'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Comment.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' }) //  定義與restaurants的關連
      Comment.belongsTo(models.User, { foreignKey: 'userId' }) //  定義與user的關連
    }
  };
  Comment.init({
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  })
  return Comment
}
