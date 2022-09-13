'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename) // __filename -> 當前的檔案 -> index.js
const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, '../config/config.json'))[env]
const db = {}

// 資料庫連線
let sequelize
if (config.use_env_variable) { // 如果 config 裡面有 use_env_variable，就會優先使用環境變數作為連線參數，而不是使用 config.json 裡面設定好的內容
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else { // 部屬上線後，資料庫密碼不會放進 config 的 production，反而會另外在雲端位置另外設定環境變數
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

// 目的：動態引入其他 models
fs // file system
  .readdirSync(__dirname) // __dirname -> 目前這支檔案所在的資料夾 -> models
  .filter(file => { // 尋找在 models 目錄底下以 .js 結尾的檔案，偵測到後會運用 sequelize 將檔案引入
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model // 利用 db.model name 存取該 model
  })

// 設定 Models (資料表)之間的關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db) // 掃描關聯，將關聯在資料表之間建立起來
  }
})

// 匯出需要的物件
db.sequelize = sequelize // 代表連線資料庫的實例
db.Sequelize = Sequelize // 代表套件(寒士庫)本身，可以使用一些屬性：DataType、Model...

module.exports = db
