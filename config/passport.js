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
      if (!user) return cb(null, false, req.flash('error_messages', 'Account or passport incorrect！'))
      const res = bcrypt.compare(password, user.password)
      if (!res) return cb(null, false, req.flash('error_messages', 'Account or passport incorrect！'))
      return cb(null, user)
    } catch (err) { console.log(err) }
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  let user = await User.findByPk(id)
  user = user.toJSON()
  return cb(null, user)
})
module.exports = passport
