const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('warning_messages', 'Email is not registered!'))

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false, req.flash('error_messages', 'Password is not correct'))
            return cb(null, user)
          })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON() // 整理格式
      return cb(null, user)
    })
})

module.exports = passport
