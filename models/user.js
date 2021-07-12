'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Comment)
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'UserId',
        as: 'FavoritedRestaurants'
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedRestaurants'
      })
      User.belongsToMany(User, {    //self-referential: 2組FK是放在同一個user model底下
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  };
  User.init({
    name: DataTypes.STRING(20),
    email: DataTypes.STRING(127),
    password: DataTypes.STRING(200),
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING(127), 
    description: DataTypes.STRING(255), 
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    createdAt: 'registeredAt'
  });
  return User;
};