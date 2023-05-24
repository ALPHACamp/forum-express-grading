const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// passport.use(new LocalStrategy(option設定客製化選項, function登入認證程序))
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } }).then(user => {
      // 使用者不存在
      if (!user) {
        return cb(
          null,
          false,
          req.flash('error_messages', '帳號或密碼輸入錯誤！')
        )
      }
      // 使用者存在
      bcrypt.compare(password, user.password).then(res => {
        // 密碼錯了
        if (!res) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        // 密碼對了
        return cb(null, user)
      })
    })
  }
)
)
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    console.log(user) // 暫時添加
    return cb(null, user)
  })
})
module.exports = passport
