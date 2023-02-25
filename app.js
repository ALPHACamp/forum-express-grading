const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// 註冊 Handlebars engine，副檔名設定hbs
app.engine('hbs', handlebars({ extname: 'hbs'}))
// 設定使用 Handlebars作為template engine
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
