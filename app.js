const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
