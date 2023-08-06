const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// Handlebars
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// Body-parser
app.use(express.urlencoded({ extended: true }))

// Express-session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Connect-flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
