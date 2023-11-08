const path = require('path') // node.js 的原生模組
const express = require('express')
const routes = require('./routes')
// 如果應用程式不是在「正式上線模式 (production mode)」中執行，就透過 dotenv 去讀取在 env 檔案裡的資訊
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const handlebars = require('express-handlebars') // 引入 express-handlebars
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入 handlebars-helpers
const app = express()
const PORT = process.env.PORT || 3000

const SESSION_SECRET = 'secret'
// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true })) // body-parser套件
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 增啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.info(`Example app listening on port ${PORT}!`)
})

module.exports = app
