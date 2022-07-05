const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) { // 照不到使用者
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        }
        // 使用者存在，所以開始驗證密碼
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！')) // 驗證失敗
            return done(null, user) // 驗證成功
          })
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user))
})

module.exports = passport
