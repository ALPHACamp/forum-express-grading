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
      User.belongsToMany(User, { // 我可以被很多人追蹤
        through: models.Followship,
        foreignKey: 'followingId', // 我的主鍵 = 別人的外鍵 = 'followingId'
        as: 'Followers' // 呼叫 user(我).Followers 將回傳所有追蹤我的人 => user(別人).followingId === user(我).id
      })
      User.belongsToMany(User, { // 我可以追蹤很多人
        through: models.Followship,
        foreignKey: 'followerId', // 我的主鍵 = 別人的外鍵 = 'followerId'
        as: 'Followings' // 呼叫 user(我).Followings 將回傳所有我追蹤的人 => user(別人).followerId === user(我).id
      })
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
