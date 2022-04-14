const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

        bcrypt.compare(password, user.password)
          .then(match => {
            if (!match) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return done(null, user)
          })
      })
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport
