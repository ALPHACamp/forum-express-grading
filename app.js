const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// setting view engine
const handlebars = require('express-handlebars')
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// setting session
const session = require('express-session')
const SESSION_SECRET = 'secret'
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// setting passport
const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// setting flash
const flash = require('connect-flash')
app.use(flash())

// setting local variable
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')

  next()
})

// setting router
const routes = require('./routes')
app.use(routes)

// start listening
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
