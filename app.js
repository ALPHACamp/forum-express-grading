const express = require('express')
const exphbs = require('express-handlebars')
const expSession = require('express-session')
const connectFlash = require('connect-flash')
const methodOverride = require('method-override')

const routes = require('./routes')
const passport = require('./config/passport.js')
const { getUser } = require('./helpers/auth-helpers.js')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ extname: '.hbs', helpers: require('./helpers/hbs-helpers.js') }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
app.use(expSession({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(connectFlash())

app.use((req, res, next) => {
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
