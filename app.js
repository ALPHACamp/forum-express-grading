const express = require('express')
const handlebars = require('express-handlebars') // 引入 express-handlebars
const methodOverride = require('method-override') // 引入套件 method-override
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport') // invoke passport
const handlebarsHelpers = require('./helpers/handlebars-helpers') // invoke handlebars-helpers
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers })) // invoke handlebarsHelpers to handlebars engine
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method')) // 使用 method-override
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
