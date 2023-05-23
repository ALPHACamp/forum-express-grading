const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')

const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')

const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const db = require('./models')

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))

// body-parser express內建
app.use(express.urlencoded({ extended: true }))

// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

// session & flash
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })) // secret改由變數帶入，變更較方便
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // multer 上傳圖片資料夾外部存取

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // res.locals設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // res.locals設定 warning_msg 訊息
  res.locals.user = getUser(req) // 把 user 變數設放到 res.locals 裡讓所有的 view 都能存取
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
