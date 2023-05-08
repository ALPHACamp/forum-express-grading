const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')

// app
const app = express()
const port = process.env.PORT || 3000

// view engine
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
