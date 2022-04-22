const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
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
      async (req, email, password, cb) => {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        const submittedPassword = await bcrypt.compare(password, user.password)
        if (!submittedPassword) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        return cb(null, user)
      }
    )
  )
  // serialize and deserialize user
  passport.serializeUser((user, cb) => {
    cb(null, user.id)
  })

  passport.deserializeUser(async (id, cb) => {
    let user = await User.findByPk(id)
    user = user.toJSON()
    return cb(null, user)
  })
}
