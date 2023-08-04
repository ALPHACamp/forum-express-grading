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
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    // cb 對應到官方文件裡的 done。這裡講師習慣寫成 cb，也就是在驗證後要執行的另一個 callback function
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
    // Sequalize 打包後的物件，多包裝了幾層，並且裡面加上一些 Sequalize 內建的參數與方法，讓我們可以直接透過 Sequalize 操作這筆資料，例如刪除或更新 user，不過我們的專案不會用到這些功能，所以就可以運用 toJSON() 這個小技巧來整理格式，把資料簡化變更為我們比較容易取用的樣子。
    user = user.toJSON()
    return cb(null, user)
  })
})
module.exports = passport