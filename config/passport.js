const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, cb) => {
      User.findOne({
        where: { email }
      })
        .then(user => {
          if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          bcrypt.compare(password, user.password).then(res => {
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
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
    return User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants' }, // as 會對應到 User model 裡設定的別名
        { model: Restaurant, as: 'LikedRestaurants' }
      ]
    })
      .then(user => {
        // console.log(user)
        cb(null, user.toJSON())
        // console.log(user.toJSON())
      })
      .catch(err => cb(err))
  })
}

// module.exports = passport
