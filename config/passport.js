const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

        bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
          })
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    include: [
      //! as: 表示想要引入的關係，必須跟 user model 中設定的關聯名稱相同
      { model: Restaurant, as: 'FavoritedRestaurants' }, // action 取得 req.user.FavoritedRestaurants
      { model: Restaurant, as: 'LikedRestaurants' } // action 取得 req.user.LikedRestaurants
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
