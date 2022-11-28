const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

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
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user優點是伺服器記憶體不會消耗那麼快，而缺點是這樣一來需要跟資料庫做更頻繁的溝通來拿資料。
// 避免存入所有USER資訊至session造成伺服器記憶體負擔，將user序列化user.id
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// 利用user.id反序列化來取得user資訊
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user.toJSON())
  })
})

module.exports = passport
