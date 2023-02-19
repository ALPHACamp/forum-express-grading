const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('warning_messages', '此信箱尚未註冊'))
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return done(null, false, req.flash('error_messages', '輸入的帳號或密碼錯誤'))
            return done(null, user, req.flash('success_messages', '登入成功'))
          })
          .catch(err => done(err, null))
      })
      .catch(err => done(err, null))
  }
))

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // 取得使用者資料的哪些欄位,並回傳至 callback 的 profile 參數
  },
  (token, refreshToken, profile, done) => {
    const { name, email } = profile._json
    const randomPassword = Math.random().toString(36).slice(-8)
    User.findOne({ where: { email } })
      .then(user => {
        if (user) return done(null, user)
        User.create({ id: uuidv4(), name, email, password: bcrypt.hashSync(randomPassword, 10) })
          .then(user => { return done(null, user) })
          .catch(err => { return done(err, false) })
      })
      .catch(err => done(err, false))
  }
))

// 從user資料中撈ID
passport.serializeUser((user, done) => done(null, user.id))
// 以ID去撈user資料 (要資料庫回傳的資料寫這)
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err, null))
})

module.exports = passport
