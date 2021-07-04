const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
if (process.env.NODE_ENV !== 'production') {require('dotenv').config() }
const PORT = process.env.PORT || 3000


app.engine('hbs', exphbs({ 
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers') 
})) 
app.set('view engine', 'hbs')

//folder paths
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(__dirname + '/upload'))

const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
app.use(session({
  secret: 'nanana',    //when using env: process.env.SESSION_SECRET 
  resave: true, 
  saveUninitialized: true 
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.currentuser = req.user
  next()
})

//set method-override
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


require('./routes')(app, passport)
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

module.exports = app