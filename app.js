const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
require('dotenv').config()

const passport = require('./config/passport')
const routes = require('./routes')
const handlebarsHelper = require('./helpers/handlerBars-helper')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
