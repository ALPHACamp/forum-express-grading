const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'email', passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ where: { email } })
    .then(user => {
      // 如果帳戶輸入錯誤或者沒有註冊
      if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      // 如果密碼輸入錯誤，為了安全性，提示會是同一個，需比對bcrypt的轉換後是否一樣
      bcrypt.compare(password, user.password)
        .then(res => {
          if (!res) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return done(null, user)
        })
    })
}))
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  // 使req.user一併引入與餐廳的關係(as:'FavoritedRestaurants')
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'likedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
    ]
  })
    .then(user => {
      done(null, user.toJSON())
    })
    .catch(err => done(err))
})

module.exports = passport
