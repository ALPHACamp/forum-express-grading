const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const session = require('express-session')
const SESSION_SECRET = 'secret'
const flash = require('connect-flash')
const passport = require('./config/passport')

app.use(express.urlencoded({ extended: true }))
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
