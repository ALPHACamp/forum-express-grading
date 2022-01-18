const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))

        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))

          return cb(null, user)
        })
      })
      .catch(err => cb(err))
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport
