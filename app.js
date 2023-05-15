const express = require('express')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
