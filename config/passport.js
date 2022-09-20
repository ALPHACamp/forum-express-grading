const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, cb) => {
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '查無此帳號'))
      bcrypt.compare(password, user.password)
        .then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '密碼錯誤'))
          return cb(null, user)
        })
    })
}
))
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  // User.findByPk(id).then(user => {
  // return cb(null, user.toJSON())
  User.findOne({ where: { id } })
    .then(user => {
      return cb(null, user.toJSON())
    })
})
module.exports = passport
