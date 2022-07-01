const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

// this is for automatic test
module.exports = app
