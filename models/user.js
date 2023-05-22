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
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'userId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants'
      })
      // this user's followers
      User.belongsToMany(User, { // 關聯自己不用寫成models.User
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      // this user's followings
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  };
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {
      sequelize, // We need to pass the connection instance
      modelName: 'User',
      tableName: 'Users', // 手動指定table name
      underscored: true
    }
  )
  return User
}
