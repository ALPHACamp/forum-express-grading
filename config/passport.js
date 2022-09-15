const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))

        bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))
            return done(null, user) // 這邊表示登入的驗證成功
          })
      })
  }))
// 序列化 使用者 必要
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 反序列化 使用者 必要
passport.deserializeUser((id, done) => {
  User.findByPk(id) // sequelize 物件
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport
