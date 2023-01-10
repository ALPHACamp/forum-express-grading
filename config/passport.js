const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User, Restaurant } = require('../models')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('warning_messages', 'Email is not registered!'))

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return cb(null, false, req.flash('error_messages', 'Password is not correct'))
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
    include: [{ model: Restaurant, as: 'FavoritedRestaurants' }] // 一併取出使用者收藏的餐廳資料，用as才知道是引入哪個關係
  })
    .then(user => cb(null, user.toJSON())) // 整理格式
    .catch(err => cb(err))
})

module.exports = passport
