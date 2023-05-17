if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

// handlebars設定
app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// body-parser設定
app.use(express.urlencoded({ extended: true }))

// session設定
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

// flash訊息設定
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
