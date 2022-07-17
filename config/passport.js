const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } }).then(user => {
      if (!user) return done(null, false, req.flash('error_messages', 'Invalid email or password'))
      bcrypt.compare(password, user.password).then(res => {
        if (!res) return done(null, false, req.flash('error_messages', 'Invalid email or password'))
        return done(null, user)
      })
    })
  }
))

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
