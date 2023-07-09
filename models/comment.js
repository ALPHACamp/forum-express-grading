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
    static associate(models) {
      // define association here
      // 新增以下
      Comment.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
      Comment.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Comment.init({
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER, // 修改這裡
    restaurantId: DataTypes.INTEGER // 修改這裡
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    underscored: true
  })
  return Comment
}
