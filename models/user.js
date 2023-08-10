'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, // 多對多關係
        {
          through: models.Favorite,
          foreignKey: 'userId',
          as: 'FavoritedRestaurants'
        }

      )
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE // for soft delete
  }, {
    sequelize, // 把index.js instance 的sequelize物件塞進去
    modelName: 'User',
    tableName: 'Users', // 手動新增table名稱
    paranoid: true, // 啟動soft delete
    underscored: true
  })
  return User
}
