const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        }
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            }
            return done(null, user)
          })
      })
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [{
      model: Restaurant,
      as: 'FavoritedRestaurants'
    },
    {
      model: Restaurant,
      as: 'LikedRestaurants'
    }
    ]
  })
    .then(user => {
      user = user.toJSON()
      // console.log(user)
      return done(null, user)
    })
    .catch(err => done(err))
})

module.exports = passport
