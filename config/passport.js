const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
// const db = require('../models')
// const User = db.User 改成以下解構方式取得資訊
const { User, Restaurant } = require('../models')
// set up Passport strategy
passport.use(new LocalStrategy( // 選擇使用passport策略，使用LocalStrategy策略LocalStrategy( 設定客製化選項, 登入認證程序 )
  // customize user field
  {
    usernameField: 'email', // 帳號用email
    passwordField: 'password', // 密碼用密碼
    passReqToCallback: true // 回傳資訊至req
  },
  // authenticate user
  (req, email, password, cb) => { // cb = callback = 官方文件的 done
    User.findOne({ where: { email } }) // database 找以上 email
      .then(user => { // 相同 email 的資訊帶入 user
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！')) // if database不存在以上 email 直接通知 client ，存在就繼續下一步
        bcrypt.compare(password, user.password) // bcrypt解析 輸入的 password 與該 email database 的 password
          .then(res => {
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！')) // 不一樣直接通知 client，一樣就繼續下一步
            return cb(null, user) // 以上沒問題把 user 回傳進行下一步
          })
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => { // user id 反序列化去database抓以下資料
  return User.findByPk(id, { // 抓user id
    include: [ // 包含以下資訊一起抓取
      { model: Restaurant, as: 'FavoritedRestaurants' }, // Restaurant關聯的FavoritedRestaurants多對多關係
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    // .then(user => {
    //   user = user.toJSON()
    //   return cb(null, user) 以下優化
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
