'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite, // -透過關係表 (join table) 建立多對多關係
        foreignKey: 'userId',
        as: 'FavoritedRestaurants' // -將多對多關係命名
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
