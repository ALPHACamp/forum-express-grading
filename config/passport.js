const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// 選擇登入策略
passport.use(new LocalStrategy(
  // 客製化欄位資料+選項
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // 驗證登入流程
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤'))

        bcrypt.compare(password, user.password).then(res => {
          if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤'))

          return done(null, user)
        })
      })
  }
))

// serialize
passport.serializeUser((user, done) => {
  done(null, user.id)
})
// deserialize user
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }, // 取用的關係必須明確指定
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err))
})
module.exports = passport
