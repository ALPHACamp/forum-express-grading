const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
// set up Passport strategy
passport.use(new LocalStrategy( // passport.use(new LocalStrategy(option 設定客製化選項, function登入的認證程序))
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 因為設置了 flash message，現在也想沿用，那麼就必須在 Passport 的驗證邏輯裡，拿到 req 這個參數。
  },
  // authenticate user
  (req, email, password, cb) => { // cb = callback
    User.findOne({ where: { email } })
      .then(user => {
        // 找不到使用者
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！')) // 第一個 null 是 Passport 的設計，代表沒有錯誤發生
        // 使用者存在，驗證密碼
        bcrypt.compare(password, user.password).then(res => {
          // 找到 user 但資料庫裡的密碼和表單密碼不一致
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          // 驗證通過
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
// 序列化 (serialization) 是一種轉換資料轉化為可儲存形式的過程 (process)，並且這個形式能夠在需要的時候恢復原先狀態 (反序列化)
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
