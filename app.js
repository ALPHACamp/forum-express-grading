const express = require('express')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// set express-handlebars as view engine
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// use session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

// use flash
app.use(flash())

// add a middleware to add variables
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// use body parser to handle all the request
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
