const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret' // 因為在每個環境會用不一樣的字串

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 新增這裡
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}/`)
})

module.exports = app
