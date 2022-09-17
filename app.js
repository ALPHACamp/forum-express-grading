const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

const db = require('./models')
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash())

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// replace body-parse
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!Let's go to http://localhost:3000`)
})

module.exports = app
