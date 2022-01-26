const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
require('./models')

const routes = require('./routes')
const SESSION_SECRET = 'secret'

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
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
