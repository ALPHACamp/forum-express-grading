const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return done(
            null,
            false,
            req.flash('error_message', '帳號或密碼輸入錯誤！')
          )
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(
            null,
            false,
            req.flash('error_message', '帳號或密碼輸入錯誤！')
          )
        }
        return done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser(async (id, done) => {
  let user = await User.findByPk(id)
  user = user.toJSON()
  done(null, user)
})

module.exports = passport
