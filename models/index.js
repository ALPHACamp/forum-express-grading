'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 與資料庫連線
let sequelize
if (config.use_env_variable) {
  // sequelize的建構子
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 動態引入所有的models
fs
  .readdirSync(__dirname)
  // 把檔案過濾出來，尋找以js結尾的檔案
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 把db拿出來，建立資料表的關聯性
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// 小寫代表new出來的instance
db.sequelize = sequelize
// 大寫代表Sequelize的套件
db.Sequelize = Sequelize

module.exports = db
