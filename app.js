const express = require('express')
const handlebars = require('express-handlebars')// 引入 express-handlebars
const flash = require('connect-flash') // 引入flash套件
const session = require('express-session')// 引入session套件
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded(({ extended: true })))// 引用內建的body-parser

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())// 載入flash套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定success msg訊息
  res.locals.error_messages = req.flash('error_messages') // 設定warning msg訊息
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
