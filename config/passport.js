const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User, Restaurant } = require('../models')

// 設定Strategies (登入策略)
passport.use(new LocalStrategy(
  // 參數1:設定客製化選項:帳號用email 密碼用password
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 拿到req，供flash使用
  },
  // 參數2:一個 callback function，內容是驗證使用者。
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        // 使用者不存在
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // 使用者存在，驗證密碼
        bcrypt.compare(password, user.password).then(res => {
          // 密碼錯誤
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          // 驗證通過
          return cb(null, user)
        })
      })
  }
))
// 設定序列化、反序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    // 一併取出使用者收藏的餐廳資料
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
