const express = require('express')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 套件
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

app.engine('hbs', exphbs({ extname: '.hbs' })) // 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.set('view engine', 'hbs')// 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') // 設定 success 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning 訊息
  res.locals.error_msg = req.flash('error_msg') // 設定 error 訊息
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
