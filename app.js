const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', exphbs({ extname: '.hbs', helpers: handlebarsHelpers }))
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
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = getUser(req)
  next()
})
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
