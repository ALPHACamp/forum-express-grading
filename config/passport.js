const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        }
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) {
              return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            }
            return done(null, user)
          })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      if (!user) throw new Error("user didn't exist!")
      user = user.toJSON()
      return done(null, user)
    })
    .catch(err => console.log(err))
})
module.exports = passport
