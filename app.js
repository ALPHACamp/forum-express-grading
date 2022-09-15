const path = require('path')
const express = require('express')
const engine = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const { getUser } = require('./helpers/auth-helpers')

const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'MySecret'

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messaegs = req.flash('success_messaegs')
  res.locals.error_messaegs = req.flash('error_messaegs')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app // 因測試環境會用到app.js，必須exports
