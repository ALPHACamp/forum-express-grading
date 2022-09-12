const express = require('express')
const handlebars = require('express-handlebars')// 引入 express-handlebars
const flash = require('connect-flash') // 引入flash套件
const session = require('express-session')// 引入session套件
const passport = require('./config/passport')// 引入Passport
const handlebarsHelpers = require('./helpers/handlebars-helpers')// 引入 handlebars-helpers
const { getUser } = require('./helpers/auth-helpers') // 引入自定義的auth-helpers
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded(({ extended: true })))// 引用內建的body-parser

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())// 初始化Passport
app.use(passport.session()) // 啟動session功能

app.use(flash())// 載入flash套件
app.use((req, res, next) => {
  // 透過locals讓所有的view都能存取
  res.locals.success_messages = req.flash('success_messages') // 設定success msg訊息
  res.locals.error_messages = req.flash('error_messages') // 設定warning msg訊息
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
