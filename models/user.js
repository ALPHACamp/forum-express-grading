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
        through: models.Favorite, // Favorite is a join table
        foreignKey: 'userId',
        as: 'FavoritedRestaurants' // nickname of this relation
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like, // Like is a join table
        foreignKey: 'userId',
        as: 'LikedRestaurants' // nickname of this relation
      })
      User.belongsToMany(User, {
        through: models.Followship, // Followship is a join table for Self Joins
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship, // Followship is a join table for Self Joins
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
    image: DataTypes.STRING,
    commentCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
