const express = require('express')
const routes = require('./routes')
const hbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const passport = require('./config/passport') // 引入套件設定
const port = process.env.PORT || 3000
require('./models') // 這邊會呼叫 models 裡面的檔案，所以一定要寫

const SESSION_SECRET = 'secret'

const { getUser } = require('./helpers/auth-helper') // { getUser } = { getUser } // { getUser: [Function: getUser] }
const handlebarsHelpers = require('./helpers/handlebars-helpers')// 這邊直接使用檔案的原因是在 handlebars helper 裡面固定撰寫方式 helper: { key: value }，而檔案 exports 出來的是 { key:value } 所以不用再用解構賦值

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) // 因為太常用到了，所以就被包進 express 裡面
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(flash()) // req.flash
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(passport.initialize()) // 初始化 Passport 檔案??
app.use(passport.session())// 用檔案啟動 session 功能??

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
