const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// set up Passport strategy
// customize user field
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, cb) => {
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
    })
    .catch(err => cb(err, false))
}))

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
    .catch(err => cb(err, false))
})

module.exports = passport
