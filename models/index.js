'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 連線資料庫
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 引用本資料夾中的 models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    // 把 sequelize 跟 Sequelize.DataTypes 放入每一個 model() 裡面來使用 (eg: user.js / restaurant.js) 這會回傳一個 Model Class
    // 把 Model Class 放入 db 裡面，使用 model class 的名稱當成 db 的 key (eg: db.user = user class)
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 設定 Models 之間的關聯
Object.keys(db).forEach(modelName => {
  // 檢查 model 是否有設定 associate
  // 有的話就把 db 傳入讓他可以使用 (類似自己用自己？)
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 匯出需要的物件
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
