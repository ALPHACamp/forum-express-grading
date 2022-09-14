const express = require('express')
const routes = require('./routes')
const hbs = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000
const db = require('./models') // 這邊會呼叫 models 裡面的檔案，所以一定要寫

app.engine('hbs', hbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true })) // 因為太常用到了，所以就被包進 express 裡面
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
