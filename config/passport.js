const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    // 設定passReqToCallback: true， 可以把 callback 的第一個參數拿到 req 裡，這麼一來我們就可以呼叫 req.flash() 把想要客製化的訊息放進去。
    passReqToCallback: true
  },
  // authenticate user
  // cb 對應到官方文件裡的 done
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
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
  User.findByPk(id).then(user => {
    // console.log(user) // 暫時添加
    user = user.toJSON()
    return cb(null, user)
  })
})
module.exports = passport
