const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const db = require('./models') // 暫時新增這行，引入資料庫，檢查完可刪
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hb。s')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
