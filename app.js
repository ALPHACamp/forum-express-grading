const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(PORT, () => {
  console.info(`Example app listening on http://localhost:${PORT}`)
})

module.exports = app
