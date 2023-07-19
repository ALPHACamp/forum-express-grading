const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
// const db = require('./models') 測試db連線是否成功可以使用此程式碼
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' })
}

// 檔名結尾叫做handlebars, 主模板:main
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  extname: '.handlebars'
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

app.use(express.static('public'))

module.exports = app
