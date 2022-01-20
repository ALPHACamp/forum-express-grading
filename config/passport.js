const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, cb) => {
  return User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        req.flash('error_messages', '帳號或密碼輸入錯誤!')
        return cb(null, false)
      }

      return bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (!isMatched) {
            req.flash('error_messages', '帳號或密碼輸入錯誤!')
            return cb(null, false)
          }
          return cb(null, user)
        })
    })
    .catch(err => cb(err, false))
}))

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch(err => cb(err, false))
})

module.exports = passport
