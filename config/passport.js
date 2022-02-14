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
    (req, email, password, done) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) {
          req.flash('body', JSON.stringify(req.body))
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        }
        bcrypt.compare(password, user.password).then(matched => {
          if (!matched) {
            req.flash('body', JSON.stringify(req.body))
            return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          }
          return done(null, user)
        })
      })
    }
  )
)
// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err))
})

module.exports = passport
