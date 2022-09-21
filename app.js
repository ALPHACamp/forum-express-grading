const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const path = require('path')
const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const db = require('./models')
app.use(cookieParser())
// replace body-parse
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())

app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  // console.log('看一下', req.user)
  next()
})

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')



app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = getUser(req)
  // console.log('看三小', req.user)
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!Let's go to http://localhost:3000`)
})

module.exports = app
