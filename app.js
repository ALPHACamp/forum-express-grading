const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passpot ')
const { getUser } = require('./helpers/auth-helper')
const { currentYear } = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const path = require('path')
// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
// 設定靜態檔案位置
app.use('/upload', express.static(path.join(__dirname, 'upload')))
// 設定 method_override
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))
// 設定session
app.use(session({
  secret: 'THISISMYSECRET',
  resave: false,
  saveUninitialized: false
}))

// 啟用connect-flash
app.use(flash())
// 設定 passport
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  res.locals.currentYear = currentYear
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
