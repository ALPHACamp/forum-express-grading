const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, email, password, cb) => {
    // 查詢是否資料有輸入的email資料
    User.findOne({ where: { email } })
      .then(user => {
        // 若沒有使用者資料，回傳錯誤
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))

        // 若有使用者資料，使用bcrypt比對是否與資料庫密碼一致
        bcrypt.compare(password, user.password)
          .then(res => {
            // 若不一致，回傳錯誤
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤!'))

            // 若正確，回傳正確
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
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
