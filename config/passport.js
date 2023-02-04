const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

module.exports = app => {
  // - initialize and session
  app.use(passport.initialize())
  app.use(passport.session())

  // - LocalStrategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const foundUser = await User.findOne({ where: { email } })
          if (!foundUser) {
            return done(
              null,
              false,
              req.flash('error_msg', '信箱或密碼輸入錯誤!')
            )
          }
          // - 用戶存在
          const isMatch = await bcrypt.compare(password, foundUser.password)
          if (!isMatch) {
            return done(
              null,
              false,
              req.flash('error_msg', '信箱或密碼輸入錯誤!')
            )
          }
          return done(null, foundUser)
        } catch (error) {
          return done(error, false)
        }
      }
    )
  )

  // - serialization & deserialization
  passport.serializeUser((user, done) => {
    user = user.toJSON()
    return done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const foundUser = await User.findByPk(id)
      if (!foundUser) return done(null, false)
      return done(null, foundUser.toJSON())
    } catch (error) {
      return done(error, null)
    }
  })
}
