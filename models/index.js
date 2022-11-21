'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 資料庫連線
// 優先根據環境變數來決定連線資料庫的參數，若無的話則 config.json 寫的那些設定
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

// 動態引入其他 models
// 例如，假設有個 Model檔案 User.js，被 fs 掃描到且運用 sequelize引入進來，之後就可以用 db.User 來存取這個 Model。
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

// 設定 Models 之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 匯出需要的物件
db.sequelize = sequelize // 代表連線資料庫的 instance。這個 instance 擁有一些屬性如 queryInterface、config 等
db.Sequelize = Sequelize // 存取到 Sequelize 這個 class，代表 Sequelize 函式庫本身。這個 class 有一些屬性如 DataType、Validator、Model

module.exports = db
