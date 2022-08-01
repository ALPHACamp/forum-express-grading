const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// template engine: handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
