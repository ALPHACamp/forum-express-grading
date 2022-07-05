const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'top_secret'

const db = require('./models')

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // init passport
app.use(passport.session()) // turn on session function
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

// export app for test
module.exports = app
