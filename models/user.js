'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite, // 透過 Favorite 表來建立關聯
        foreignKey: 'userId', // 對 Favorite 表設定 FK
        as: 'FavoritedRestaurants' // 幫這個關聯取個名稱
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like, // 透過 Favorite 表來建立關聯
        foreignKey: 'userId', // 對 Favorite 表設定 FK
        as: 'LikedRestaurants' // 幫這個關聯取個名稱
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId', // 根據被追蹤的id
        as: 'Followers' // 搜尋到追蹤者id，讓我們在controller及views使用
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId', // 根據追總者的id
        as: 'Followings' // 搜尋到被追蹤的id，讓我們在controller及views使用
      })
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
