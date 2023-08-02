const express = require('express')
const app = express()
const routes = require('./routes')
const handlebars = require('express-handlebars')

const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))

app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
