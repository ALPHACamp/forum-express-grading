const express = require('express')
const routes = require('./routes')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
// const db = require('./models') for testing
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers') // auth-helpers.js 裡面做好的 function

app.engine('.hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true })) // Express v4.16 以後的版本已內建 body-parser
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能
app.use(flash())
app.use(methodOverride('_method'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)
app.listen(port, () => {
  console.info(`Forum app listening on port ${port}!`)
})

module.exports = app // 導入自動化測試以後，由於測試環境會用到 app，所以需要在文件最下方輸出 app
