const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs，且註冊handlebarsHelpers方法
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
// 設定body-parser
app.use(express.urlencoded({ extended: true }))
// 建立session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }))
// 初始化passport
app.use(passport.initialize())
// 啟動passport-session
app.use(passport.session())
// 掛載flash
app.use(flash())
// 設定method-override
app.use(methodOverride('_method'))
// 設定環境變數
app.use((req, res, next) => {
  // 設定flash訊息
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')

  // 設定user環境變數
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
