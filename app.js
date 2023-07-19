const express = require('express')
const hbs = require('express-handlebars')
const flash = require('connect-flash') // 引入套件
const session = require('express-session') // 引入套件
const routes = require('./routes')
const SESSION_SECRET = 'secret' // 新增這行

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', hbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

// 新增以下 7 行
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
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
