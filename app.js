const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const db = require('./models')

const app = express()
const port = process.env.PORT || 3000

// 註冊，並指定副檔名為.hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// 設定引用handlebars作為樣本引擎
// body-parser
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
