const express = require('express')
const path = require('path')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const methodOverride = require('method-override')
const db = require('./models')

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
