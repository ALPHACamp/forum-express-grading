'use strict'

const fs = require('fs') // Node.js 內建的檔案管理模組 fs，全名 file system
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 資料庫連線
let sequelize
if (config.use_env_variable) { // 如果在 config 裡面有一個屬性是 use_env_variable，就會優先根據環境變數來決定連線資料庫的參數，而不是我們之前在 config.json 寫的那些設定。
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 動態引入其他 models
fs
  .readdirSync(__dirname) // 讀此檔案的路徑
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 設定 Models 之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 匯出需要的物件
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
