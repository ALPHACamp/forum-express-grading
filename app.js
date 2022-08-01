const express = require('express')
const path = require('path') // 引入 path 套件
const routes = require('./routes')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override') // 引入套件 method-override
const session = require('express-session')
const passport = require('passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入 handlebars-helpers
const { getUser } = require('./helpers/auth-helpers')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret' // 新增這行

app.engine('hbs', handlebars({ extname: 'hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 新增這裡
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
