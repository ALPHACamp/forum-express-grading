'use strict'

const fs = require('fs') // fs = 'file system'
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}
// connect with db
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}
// 動態引入其他models: 在fs底下尋找'.js'檔，偵測到後sequelize引入，然後用db.ModelName存取這個model
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') // 檔名前面不含'.' && 不是目前這個檔的檔名 && 檔名結尾是'.js'
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })
// 設定models之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
// 匯出物件
db.sequelize = sequelize // 's'equelize是上面建構子創造的實體instance:連線db的instance
db.Sequelize = Sequelize // 'S'equelize是Class

module.exports = db
