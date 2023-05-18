const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()
const port = process.env.PORT || 3000

// const db = require('./models') // 暫時新增這行，引入資料庫，檢查完可刪

app.use(express.urlencoded({ extended: true })) // body-parser
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
const SESSION_SECRET = 'secret'

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
