const path = require('path')
const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const { getUser } = require('./helpers/auth-helpers')
const db = require('./models')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')

const port = process.env.PORT || 3000
app.engine('hbs', exphbs({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

const SESSION_SECRET = 'secret'
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.static('public'))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
