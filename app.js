const express = require('express')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const handlebars = require('express-handlebars')
// check for DB
// const db = require('./models')

// handlebas setting
app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')
// body-parser
app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

// for auto-test
module.exports = app
