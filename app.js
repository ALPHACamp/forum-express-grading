const express = require('express')
const path = require('path') // Node.js 的原生模組
const routes = require('./routes')
const passport = require('./config/passpoet')
const { getUser } = require('./helpers/auth-helpers')
const hbsHelpers = require('./helpers/hbs-helpers') // 自製handlebars helpers

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')

app.use(express.static('public'))
app.use('/public/images', express.static(path.join(__dirname, 'public/images'))) // 讀取預設圖片
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 讀取上傳圖片
app.use(methodOverride('_method')) // 使用 method-override，_method可以自己設定
<<<<<<< HEAD
app.engine('hbs', exphbs({ extname: '.hbs' }))
=======
app.engine('hbs', exphbs({ extname: '.hbs', helpers: hbsHelpers }))
>>>>>>> b174df1a903250f787c13e5fae2443e0dce6fb4b
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.loggedUser = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
