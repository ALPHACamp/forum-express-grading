'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
      // define association here
      Comment.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
      Comment.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Comment.init(
    {
      text: DataTypes.STRING,
      userId: DataTypes.INTEGER, // 修改這裡
      restaurantId: DataTypes.INTEGER // 修改這裡
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments',
      underscored: true
    }
  )
  return Comment
}
