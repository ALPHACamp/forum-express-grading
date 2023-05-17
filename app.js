const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const db = require('./models')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = process.env.PORT || 3000

const SESSION_SECRET = 'secret'

// 註冊，並指定副檔名為.hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// 設定引用handlebars作為樣本引擎
// body-parser
app.use(express.urlencoded({ extended: true }))
// session
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
// flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  next()
})
// 路由
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
