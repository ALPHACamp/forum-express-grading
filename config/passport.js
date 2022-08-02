const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

// login with email and password
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passReqToCallback: true
  },
  // authenticate user
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      // if the email doesn't exist, return false and redirect to login page
      if (!user) return done(null, false, req.flash('error_messages', 'Incorrect username or password.'))
      const isMatch = await bcrypt.compare(password, user.password)
      // if the password is incorrect, return false and redirect to login page
      if (!isMatch) return done(null, false, req.flash('error_messages', 'Incorrect username or password.'))
      // else return user and redirect to home page
      return done(null, user)
    } catch (e) {
      done(e, false)
    }
  }
))

// serialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// deserialize user
passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    return done(null, user.toJSON())
  })
})

module.exports = passport
