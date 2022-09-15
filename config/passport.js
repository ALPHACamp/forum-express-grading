const passport = require('passport')
const db = require('../models')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = db.User

passport.use(new localStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  async (req, email, password, cb) => {
    const user = await User.findOne({where: { email }})
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))

    const res = await bcrypt.compare(password, user.password)
    if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))

    return cb(null, user)
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id)
  const userJSON = user.toJSON()
  return cb(null, userJSON)
})

module.exports = passport