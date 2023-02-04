'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 資料庫連線
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 動態引入其他 models
fs
  .readdirSync(__dirname)
  .filter(file => {
    // 開頭為. 通常代表隱藏檔案, ex: .env    不是當前檔案            想讀取的其他模組
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
db.sequelize = sequelize // 建構的實體 : 連線資料庫的 instance。這個 instance 擁有一些屬性如 queryInterface、config 等，後面會常用到。
db.Sequelize = Sequelize // 套件 : Sequelize 這個 class，代表 Sequelize 函式庫本身。

module.exports = db
