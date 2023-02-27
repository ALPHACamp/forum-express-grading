const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
// check for DB
// const db = require('./models')

// handlebas setting
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// body-parser
app.use(express.urlencoded({ extended: true }))
// setting session & flash
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
// setting passport
app.use(passport.initialize())
app.use(passport.session())
// setting flash
app.use(flash())
// flash middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

// for auto-test
module.exports = app
