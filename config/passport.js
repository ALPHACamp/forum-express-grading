const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'eamil',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    console.log(req)
    User.findOne({ where: { email } })
      .then(user => {
        console.log(user)
        if (!user) return cb(null, false, req.flash('error_messages', 'email or password error!'))
        console.log(password)
        bcrypt.compare(password, user.password).then(res => {
          console.log(user)
          if (!res) return cb(null, false, req.flash('error_messages', 'email or password error!'))
          return cb(null, user)
        })
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    console.log(user)
    console.log(id)
    return cb(null, user)
  })
})

module.exports = passport
