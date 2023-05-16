const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入 handlebars-helpers
const { getUser } = require('./helpers/auth-helpers') // 引入自定義的 auth-helpers

// 暫時新增這行，引入資料庫，檢查完可刪 const db = require('./models')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())// 初始化passport
app.use(passport.session()) // 啟動session功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method')) // 支援 _method 用法
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')

  // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages')
  // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
