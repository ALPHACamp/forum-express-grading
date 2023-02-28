const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// Regist handlebars as engine, and setting extname as .hbs
app.engine('hbs', handlebars({ extname: 'hbs' }))
// Setting hbs as view engine
app.set('view engine', 'hbs')
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
