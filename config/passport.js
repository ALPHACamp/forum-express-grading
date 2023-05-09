const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ where: { email } })
    .then(user => {
      // email沒有使用者
      if (!user) {
        console.log('email not registered')
        return done(null, false, req.flash('error_messages', 'Email not registered!'))
      }
      // 對比password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          console.log('password incorrect')
          return done(null, false, req.flash('error_messages', 'Email or Password incorrect!'))
        }
        // 認證成功，回傳使用者
        return done(null, user)
      })
    })
}))

// 第一次登入成功時，把User.id存入session
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 已經登入過後，每次驗證都把session裡面的User.id 拿去找資料庫的User
passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    return done(null, user)
  })
})

module.exports = passport
