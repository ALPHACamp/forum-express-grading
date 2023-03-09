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
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId', // -透過被追蹤者 id 查找追隨者
        as: 'Followers'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId', // -透過追隨者 id 查找其追蹤中的人
        as: 'Followings'
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
