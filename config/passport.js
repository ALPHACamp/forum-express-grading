const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

// set passport strategy: local
// new LocalStrategy(option, function)
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        // 1. user doesn't exist: if () return
        if (!user) return cb(null, false, req.flash('error_messages', 'Incorrect email or password!'))

        bcrypt.compare(password, user.password).then(res => {
          // 2. user exists: compare password !== user.password
          // wrong password: if () return
          if (!res) return cb(null, false, req.flash('error_messages', 'Incorrect email or password!'))
          // 3. pass authenticate
          return cb(null, user)
        })
      })
  }
))

// serialize and deserialize user
// serialization: a process turn data type into storable
// only store user.id
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    // turn user object into plain object
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport