const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User, Restaurant } = require('../models')
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
  // Customize user field
  {
    usernameField: 'email',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        // User not found
        if (!user) {
          return done(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }

        // Password validation failed
        bcrypt.compare(password, user.password)
          .then(isEqual => {
            if (!isEqual) {
              return done(
                null,
                false,
                req.flash('error_messages', '帳號或密碼輸入錯誤！')
              )
            }

            // Valid user and password
            return done(null, user)
          })
      })

    // Serialize and Deserialize
    passport.serializeUser((user, done) => {
      return done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
      User.findByPk(id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }).then(user => done(null, user.toJSON()))
    })
  }))

module.exports = passport
