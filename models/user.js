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
        as: 'LikeRestaurants'
      })
      User.belongsToMany(User, { // 找出「被哪些人追蹤」
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, { // 找出「自己追蹤哪些人」
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
