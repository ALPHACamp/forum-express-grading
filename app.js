// 重要 每次打開都要設定 nvm use 14.16.0 node版本

const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
