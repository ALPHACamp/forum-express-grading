const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport') // 引入 passport
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// const db = require('./models') //測試db是否可以連線正常

// setting view engine 使用handlebars-helpers需在引入後，在這裡加入helpers: handlebarsHelpers
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
// setting body-parser
app.use(express.urlencoded({ extended: true }))
// setting method-Override
app.use(methodOverride('_method'))
// setting static file
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// setting session
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
// setting passport，put it before setting routes
usePassport(app)
// app.use(passport.initialize())
// app.use(passport.session())

// setting flash
app.use(flash())
// setting locals data for view
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
