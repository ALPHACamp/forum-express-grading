'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env] // Node.js 有提供一個工具模組專門來處理路徑問題，這個模組叫做 Path, 這裡我們用 path.resolve 方法修改
const db = {}

// 第一段：與資料庫連線
// 呼叫剛剛在 config.json 裡的設定檔
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 第二段：動態引入其他 models
fs
  .readdirSync(__dirname)
  .filter(file => { // 尋找在 models 目錄底下以 .js 結尾的檔案。
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => { // 偵測到檔案以後，自動運用 sequelize 將其引入
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

// 第三段：設定 Models 之間的關聯
// 掃描關聯設定，並且把這些 model 設定在資料庫端建立起來。
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
// 第四段：匯出需要的物件
db.sequelize = sequelize // 代表連線資料庫的 instance。這個 instance 擁有一些屬性如 queryInterface、config 等
db.Sequelize = Sequelize // 表 Sequelize 函式庫本身, 可以用 db.Sequelize 存取到 Sequelize 這個 class 

module.exports = db
