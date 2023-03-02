const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 這裡用解構賦值，等於是直接配合 export 多個變數的寫法，為了未來可能輸出多個變數做準備 (我猜的)
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// const db = require('./models') // 一開始明明加了，但好像一直沒用到

app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
// passport 需在 session 後，因為會用到 session 嘛~
app.use(passport.initialize())
app.use(passport.session()) // 這裡會用到
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(flash()) // 掛載套件
// 使用 connect-flash
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req) // 注意增減的 code 與這個檔案到底有無關係 (這段跟 passport 有關，而非 app.js)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port http://localhost:${port}`)
})

// 導入自動化測試以後，由於測試環境會用到 app，所以需要在文件最下方輸出 app
module.exports = app
