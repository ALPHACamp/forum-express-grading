// // Sequelize 定義 Model 的語法有兩種，一種是 sequelize.define，而這兒的版本是用 init: 先定義一個 User，這個 User 繼承自 Model，可以使用 Model 提供的各種方法。呼叫 User.init 方法來定義欄位，包括 name, email 跟 password，型態都是 DataTypes.STRING，最後把這個做好的 Model 回傳、匯出
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
      User.belongsToMany(User, {
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
  }
  User.init({ // 呼叫 User.init 方法來定義欄位，包括 name, email 跟 password，型態都是 DataTypes.STRING
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // 一般情況下，Sequelize 會根據你指定的 model name，自動到資料庫產生一張對應的資料表，命名採用複數，例如 model name 是 User，自動產生的 table name 會是 Users。不過這裡我們再動手指定一下 table name 為 Users
    underscored: true // underscored 這個參數，讓Sequelize把 lowerCamelCase 和 snack_case 的變數自動做雙向轉換
  })
  return User // // 最後把這個做好的 Model 回傳、匯出
}
