const path = require('path')
const handlebars = require('express-handlebars')
const express = require('express')

const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(methodOverride('_method')) // 使用 method-override
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // __dirname是絕對路徑 +upload就可以讀到upload資料夾
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.loginUser = getUser(req) // 寫了這個之後你的路由都會附帶著user
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info('http://localhost:3000/')
})

module.exports = app
// 注意：導入自動化測試以後，由於測試環境會用到 app，所以需要在文件最下方輸出 app
