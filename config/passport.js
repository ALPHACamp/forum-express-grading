const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))

        bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) return done(null, false, req.flash('error_messages', '帳號或密碼錯誤!'))
            return done(null, user) // 這邊表示登入的驗證成功
          })
      })
  }))
// 序列化 使用者 必要
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 反序列化 使用者 必要 (得 req.user)
passport.deserializeUser((id, done) => {
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }, // 根據 FavoriteRestaurants 關係到 Restaurant model 得到 user 收藏列表(登入時 req.user 就會自帶有關收藏的相關資料)
      { model: Restaurant, as: 'LikedRestaurants' }, // 跟 Restaurant 有一個關聯叫做 LikedRestaurants，將其引入
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }) // sequelize 物件
    .then(user => done(null, user.toJSON())
    )
})

module.exports = passport
