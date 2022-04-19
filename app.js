// 重要 每次打開都要設定 nvm use 14.16.0 node版本
const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.use(session({ secret: SESSION_SECRET, resave: false, saveUnintialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messageg = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
