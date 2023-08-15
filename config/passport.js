const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        // user 不存在 提示 帳號或密碼輸入錯誤
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        // user 存在 比較 輸入的 password 與 database password
        bcrypt.compare(password, user.password).then(res => {
          // res => compare 的值, true / false
          if (!res) {
            return cb(
              null,
              false,
              req.flash('error_messages', '帳號或密碼輸入錯誤！')
            )
          }
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
// 取出使用者資料
// 使用 req.user 時，一併取得收藏餐廳的資料
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [{ model: Restaurant, as: 'FavoritedRestaurants' }] // 對應 user  model
  })
    .then(user => {
      user = user.toJSON()
      // console.log(user)
      return cb(null, user)
    })
    .catch(err => cb(err))
})
module.exports = passport
