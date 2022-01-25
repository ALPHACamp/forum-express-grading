const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// 註冊 handlebars 樣板引擎，指定副檔名為 .hbs，接著設定使用 handlebars 作為樣板引擎
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// 路由入口
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
