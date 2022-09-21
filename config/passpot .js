const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models/index')
const { User } = db
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, done) => {
    try {
      // 確認email是否存在
      const user = await User.findOne({ where: { email } })
      if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

      return done(null, user.toJSON())
    } catch (error) {

    }
  }))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    done(null, user.toJSON())
  } catch (error) {
    console.log(error)
  }
})

module.exports = passport
