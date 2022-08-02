const express = require('express')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// template engine: handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// middleware: body-parser, method-override
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
