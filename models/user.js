'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model { // 定義 model 的其中一個方法：先定義一個 User 並讓 User 繼承 Model，因此可以使用 Model 的各種方法，包括 init
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  User.init({ // 呼叫 init 方法去定義欄位
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User // 將結果輸出讓其他套件可以使用
}
