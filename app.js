const express = require('express')
const routes = require('./routes')
const exphbs = require('express-handlebars')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ extname: '.hbs' }))

app.set('view engine', '.hbs')
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
