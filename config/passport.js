const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      }
      return bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (!isMatched) {
            return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          }
          return done(null, user)
        })
    })
    .catch(error => done(error, false))
}))

passport.serializeUser((user, done) => {
  done(false, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => done(null, user.toJSON()))
    .catch(error => done(error, false))
})

exports = module.exports = passport
