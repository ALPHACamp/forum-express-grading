const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return done(null, false, req.flash('error', '帳號或密碼錯誤!'))
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('error', '帳號或密碼錯誤!'))
              }

              return done(null, user)
            })
        })
        .catch(err => done(err))
    }
  )
)

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
