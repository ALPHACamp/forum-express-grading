const passport = require('passport')
const LocalStrategy = require('./strategies/local')
const db = require('../models')
const User = db.User

// Strategies
LocalStrategy(passport)

// 第一次登入成功時，把User.id存入session
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

// 已經登入過後，每次驗證都把session裡面的User.id 拿去找資料庫的User
passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    return done(null, user.toJSON())
  })
})

module.exports = passport
