const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

// 暫時新增這行，引入資料庫，檢查完可刪 const db = require('./models')
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
