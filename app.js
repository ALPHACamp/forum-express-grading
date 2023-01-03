const path = require('path') // Node.js 的原生模組

const express = require('express')
const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000

// 套件
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
// 載入
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const hbsHelpers = require('./helpers/handlebars-helpers') // 自製handlebars helpers

app.engine('hbs', exphbs({ extname: '.hbs', helpers: hbsHelpers })) // 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs，把 自製 helpers 註冊起來
app.set('view engine', 'hbs')// 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method')) // 使用 method-override，_method可以自己設定
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // view 圖片均為：src="/upload/xxxx"，當讀到 /upload時，去找upload這個資料夾：__dirname＝當前檔案所在的資料夾的絕對路徑

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg') // 設定 success 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning 訊息
  res.locals.error_msg = req.flash('error_msg') // 設定 error 訊息
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
