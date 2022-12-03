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
      // hasMany() 是1:M關係
      User.hasMany(models.Comment, { foreignKey: 'userId' })
      // belongsToMany() 是M:M關係
      User.belongsToMany(models.Restaurant, {
        through: models.Favorite, // 透過favorite表來做紀錄
        foreignKey: 'userId',
        as: 'FavoritedRestaurants' // 定義關係叫做被收藏的餐廳
      })
      User.belongsToMany(models.Restaurant, {
        through: models.Like,
        foreignKey: 'userId',
        as: 'LikedRestaurants' // 定義關係叫做被按Like的餐廳
      })
      // 同一個資料表自己和自己有關係，稱為自關聯 (Self-referential Relationships) 或自連接 (Self Joins)
      // 找出所有 followingId 是 5 的人，就是我的 follower
      // 找出所有 followerId 是 5 的人，就是我在 following 的人
      // User 的追蹤者
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      // User 追蹤中的 User
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 新增這裡
    underscored: true
  })
  return User
}

// model資料是純 JavaScript 實作，以js小駝峰式寫法命名就可以
// underscored 副指令會在操作資料庫的時候，幫我們把 JavaScript 這邊的命名自動轉成 snake case 的欄位名稱 is_admin
