const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('warning_messages', '此信箱尚未註冊'))
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return done(null, false, req.flash('error_messages', '輸入的帳號或密碼錯誤'))
            return done(null, user)
          })
          .catch(err => done(err, null))
      })
      .catch(err => done(err, null))
  }
))

// 從user資料中撈ID
passport.serializeUser((user, done) => done(null, user.toJSON().id))
// 以ID去撈user資料 (要資料庫回傳的資料寫這)
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err, null))
})

module.exports = passport
