const express = require('express')
const handlbars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes')
const passport = require('./config/passport')
const SESSION_SECRET = 'secret'

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlbars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
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
