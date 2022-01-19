const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const middleware = require('./middleware/middleware')

const app = express()
const port = process.env.PORT

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// http and session
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(flash())
app.use(middleware.localVariable)

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
