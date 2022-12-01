const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // 客製化選項
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // 登入認證程序 驗證使用者
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        // 使用者不存在
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // 使用者存在，驗證密碼
        bcrypt.compare(password, user.password).then(res => {
          // 密碼錯了
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          // 驗證通過
          return cb(null, user)
        })
      })
  }
))
// 序列化 反序列化
// 優點是伺服器記憶體不會消耗那麼快，而缺點是這樣一來需要跟資料庫做更頻繁的溝通來拿資料。
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
