const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const session = require('express-session')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const passport = require('./config/passport')
const hbsHelper = require('./helper/handlebars-helpers')
const { getUser } = require('./helper/auth-helpers')
// const db = require('./models') 測試db連線是否成功可以使用此程式碼
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' })
}

// 檔名結尾叫做handlebars, 主模板:main
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: hbsHelper
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
  secret: 'Neuro_Sama_is_SoCute',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.error_messages = req.flash('error_messages')
  res.locals.success_messages = req.flash('success_messages')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

app.use(express.static('public'))

module.exports = app
