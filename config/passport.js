const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// Strategies
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  async (req, email, password, cb) => {
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', 'Account or Password error!'))
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return cb(null, false, req.flash('error_messages', 'Account or Password error!'))
    return cb(null, user)
  }
))
// Serialize and deserialize
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  let user = await User.findByPk(id)
  user = user.toJSON()
  return cb(null, user)
})

module.exports = passport
