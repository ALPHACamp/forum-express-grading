const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
// set up Passport strategy
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
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  // 迭代1 為了要使用passport的反序化來查詢mysql資料
  // cb就是callback
  // 查詢完後再把裝入favorite關聯的user cb回瀏覽器上
  // User.findByPk(id).then(user => {
  //   user = user.toJSON()
  //   return cb(null, user)
  // })
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    // 迭代2 簡化程式碼
    // .then(user => {
    //   user = user.toJSON()
    //   return cb(null, user)
    // })
    .then(user => {
      cb(null, user.toJSON())
    })
    .catch(err => cb(err))
})
module.exports = passport
