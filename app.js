const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const helpers = require('./middleware/helpers')
const handlebarsHelpers = require('./middleware/handlebars-helpers')

const app = express()
const port = process.env.PORT

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// http and session
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(helpers.localVariable)

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
