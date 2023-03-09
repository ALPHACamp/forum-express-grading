const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
console.log(process.env.IMGUR_CLIENT_ID)

const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
const path = require('path')
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const methodOverride = require('method-override')
// const getUser = require('./helpers/auth-helpers').getUser
const handlebarsHelpers = require('./helpers/handlebars-helpers')
// check for DB
// const db = require('./models')

// handlebas setting
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
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
// for PUT & DELETE routes
app.use(methodOverride('_method'))
// for image upload
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// setting flash
app.use(flash())
// flash middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}! http://localhost:${port}/`)
})

// for auto-test
module.exports = app
