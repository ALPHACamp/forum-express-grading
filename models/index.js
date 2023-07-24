'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 資料庫連線
// -> 呼叫在config.js裡的設定檔
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 動態引入其他 models
// 尋找在 models 目錄底下以 .js 結尾的檔案
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 設定 Models 之間的關聯
// 掃描每個 model 之間的關聯設定，之後可以用 sequelize 的語法去建立關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 匯出需要的物件

// 代表連線資料庫的 instance
db.sequelize = sequelize
// Sequelize 這個 class，代表 Sequelize 函式庫本身
db.Sequelize = Sequelize

module.exports = db
