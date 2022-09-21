const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
        //  console.log('進到!user？')
          return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        }
        bcrypt.compare(password, user.password)
          .then(res => {
            if (!res) {
              // console.log('還是到了這邊？')
              return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            }
            console.log('應該要可以登入了喔')
            return done(null, user)
          })
      })
  }
))
// serialize and deserialize user
passport.serializeUser((user, done) => {
  console.log('但是有跑進這裡')
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  console.log('有近序列化嗎')
  User.findByPk(id)
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
    .catch(err => console.log(err))
})
module.exports = passport
