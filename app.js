// FilePath: controllers/user-controllers.js
// Include modules and declare related variables
const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// View engine
app.engine('hbs', handlebars({ extname: 'hbs' }))
app.set('view engine', 'hbs')

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
