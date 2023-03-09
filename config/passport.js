const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

// const db = require('../models')
// const User = db.User
const { User, Restaurant } = require('../models')

// set up Passport strategy 設定策略
passport.use(new LocalStrategy(
  // customize user field 設定客製化選項,passReqToCallback:客製化使用者欄位名稱
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user : cb = 驗證後要執行的另一個 callback function: 判斷順序1.使用者不存在 2.密碼錯了 3.通過!
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
// serialize and deserialize user 序列化與反序列化 : 利用user.id避免物件實力大量存佔在session空間
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => { // 從資料庫取出使用者資料
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }
    ]
  })
    .then(user => cb(null, user.toJSON())) // 整理sequelize包裝了幾層的物件
    .catch(err => cb(err))

  // 檢查用
  // .then(user => {
  // user = user.toJSON()
  // console.log(user)
  // return cb(null, user)
  // })
})
module.exports = passport
