const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')

const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const handlebarsHelper = require('./helpers/handlebars-helper')
const { getUser } = require('./helpers/auth-helpers')
const flash = require('connect-flash')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.set('view engine', 'hbs')
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // res.locals.error_msg = req.flash('error_msg')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port http://localhost:${port} !`)
})

module.exports = app
