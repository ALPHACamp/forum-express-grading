const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// const db = require('./models')

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info('http://localhost:3000/')
})

module.exports = app
// 注意：導入自動化測試以後，由於測試環境會用到 app，所以需要在文件最下方輸出 app
