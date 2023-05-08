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
  async (req, email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

      return cb(null, user)
    } catch (err) {
      return cb(err, null)
    }
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})
module.exports = passport
