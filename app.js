
const path = require('path') // node.js原生module

// require modules
const express = require('express')
const routes = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
const usePassport = require('./config/passport')
const handlebars = require('express-handlebars')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')

// set server
const app = express()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
// 註冊 helpers : {} 後面接物件
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
// set session
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
// set body-parser
app.use(express.urlencoded({ extended: true }))

// set passport
usePassport(app)

// set middlewares
app.use(flash())
app.use(methodOverride('_method'))
// 靜態檔案, 透過express.static來指定路徑
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use((req, res, next) => {
  // 設定 locals 使前端樣板可存取變數
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

// set routes
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port http://localhost:${port}`)
})

module.exports = app
