const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('./config/passport')  // our customized passport configuration file
const bodyParser = require('body-parser')
const { storeLocalVariables } = require('./middlewares/storeLocalVariables')

const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')
app.use('/upload', express.static(__dirname + '/upload'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())  // passport initialize
app.use(passport.session())  // activate passport session
app.use(flash())
app.use(storeLocalVariables)


app.listen(port, () => {
  db.sequelize.sync()  // sync models with our database
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
