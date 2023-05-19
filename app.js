const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const db = require('./models')
const { getUser } = require('./helpers/auth-helpers') // 增加這行，引入自定義的 auth-helpers 可視為getUser為一個function
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const path = require('path') // todo 給/upload使用

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = 'secret'

// 註冊，並指定副檔名為.hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
// 設定引用handlebars作為樣本引擎
// body-parser
app.use(express.urlencoded({ extended: true }))
// session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
// passport 皆在session 後
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能
// method-override
app.use(methodOverride('_method'))
//! /upload
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req) // helpers
  next()
})
// 路由
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
