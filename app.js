// packages and variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// template engine: handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// middleware: body-parser, method-override
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// middleware: session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// middleware: passport init
app.use(passport.initialize())
app.use(passport.session())

// middleware: flash and locals
app.use(flash())
app.use((req, res, next) => {
  // res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
