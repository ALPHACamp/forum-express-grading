const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const routes = require('./routes')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helper')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// set express-handlebars as view engine
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// use session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

// use passport
app.use(passport.initialize())
app.use(passport.session())

// use flash
app.use(flash())

// use method-override
app.use(methodOverride('_method'))

// allow dirctly get info from upload folder
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// add a middleware to add variables
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = getUser(req)
  next()
})

// use body parser to handle all the request
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
