const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({ extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port http://localhost:${port}`)
})

module.exports = app
