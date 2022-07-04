// Include modules
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

// Set passport strategy
passport.use(new LocalStrategy(
  // Customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // Authenticate user
  async (req, email, password, cb) => {
    // Check if email already exists
    const user = await User.findOne({ where: { email } })
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

    // Check if password correct
    const passwordMatch = bcrypt.compareSync(password, user.password)
    if (!passwordMatch) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

    // Email and password correct
    return cb(null, user)
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser(async (id, cb) => {
  const user = await User.findByPk(id)
  return cb(null, user.toJSON())
})

module.exports = passport
