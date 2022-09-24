const express = require('express')
const routes = require('./routes')
const hbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const passport = require('./config/passport') // 引入套件設定
const methodOverride = require('method-override')
const path = require('path')
const hbsHelpers = require('handlebars-helpers') // 外部套件
const multiHelpers = hbsHelpers()
const port = process.env.PORT || 3000
require('./models') // 這邊會呼叫 models 裡面的檔案，所以一定要寫'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} // 這邊的意思是 -> 如果應用程式不是在正式上線模式(也就是 Heroku 中設定的環境變數)就去讀取 .env

const SESSION_SECRET = 'secret'

const { getUser } = require('./helpers/auth-helpers') // { getUser } = { getUser } // { getUser: [Function: getUser] }
const handlebarsHelpers = require('./helpers/handlebars-helpers')// 這邊直接使用檔案的原因是在 handlebars helper 文件固定撰寫方式 helper: { key: value }，而檔案 exports 出來的是 { key:value } 所以不用再用解構賦值(一個檔案多個 function 也不用再展開)

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers, multiHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) // 因為太常用到了，所以就被包進 express 裡面
app.use(methodOverride('_method'))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(flash()) // req.flash
app.use(passport.initialize()) // 初始化 Passport 檔案??
app.use(passport.session())// 用檔案啟動 session 功能??
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 讓外部傳入的 request 可以取得 /upload 路徑，由於不是一般路徑，直接用靜態檔案方式指定路徑

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
