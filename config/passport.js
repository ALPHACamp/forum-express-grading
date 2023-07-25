const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// new LocalStrategy :第一個參數為客製化選項，第二個參數為登入認證程序
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 這邊的設定對應下個函式的參數req
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_message', '帳號或密碼輸入錯誤!'))
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) return cb(null, false, req.flash('error_message', '帳號或密碼輸入錯誤!'))

            return cb(null, user)
            // 第一個 null 是 Passport 的設計，代表沒有錯誤發生，第二個參數如果傳到 user，就代表成功登入了，並且會回傳 user。
          })
      })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      // 原本沒有經過轉換的是原始sequelize物件，可以直接用sequelize語法編輯，但這邊不需要那些功能
      // console.log(user) //檢查用
      return cb(null, user)
    })
})
module.exports = passport
