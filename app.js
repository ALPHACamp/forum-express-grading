const express = require('express')
const routes = require('./routes')
const passport = require('./config/passpoet')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

app.use(express.static('public'))
app.engine('hbs', exphbs({ extname: '.hbs' }))
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
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
