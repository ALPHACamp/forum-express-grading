const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(
  new LocalStrategy(
    // 第一個參數傳入客製化的選項: customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // 因為flash需要req，true後才可以給下面用req
    },
    // 第二個參數是一個 callback function: authenticate user
    // email也可以自取，例如改成username，where {email:username}。官方文件用done，教案TA習慣用cb。
    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤！')
          )
        }
        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(
              null,
              false,
              req.flash('error_messages', '帳號或密碼輸入錯誤！')
            )
          }
          return cb(null, user)
        })
      })
    }
  )
)
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    // console.log(user);
    // User {
    //   dataValues: {
    //     id: 1,
    //     name: 'test',
    //     email: 'test1@tt.tt',
    //     password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
    //     createdAt: 2022-11-22T03:48:44.000Z,
    //     updatedAt: 2022-11-22T03:48:44.000Z
    //   },
    //   _previousDataValues: {
    //     id: 1,
    //     name: 'test',
    //     email: 'test1@tt.tt',
    //     password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
    //     createdAt: 2022-11-22T03:48:44.000Z,
    //     updatedAt: 2022-11-22T03:48:44.000Z
    //   },
    //   uniqno: 1,
    //   _changed: Set(0) {},
    //   _options: {
    //     isNewRecord: false,
    //     _schema: null,
    //     _schemaDelimiter: '',
    //     raw: true,
    //     attributes: [ 'id', 'name', 'email', 'password', 'createdAt', 'updatedAt' ]
    //   },
    //   isNewRecord: false
    // }
    user = user.toJSON()
    //  console.log("toJSON後", user);
    //  toJSON後 {
    //   id: 1,
    //   name: 'test',
    //   email: 'test1@tt.tt',
    //   password: '$2a$10$S.RBcI0QnouTaxrkvcKmtOPCA0x.pHnoQzrKS1THl.6NhIdZU7nba',
    //   createdAt: 2022-11-22T03:48:44.000Z,
    //   updatedAt: 2022-11-22T03:48:44.000Z
    // }
    return cb(null, user)
  })
})
module.exports = passport

// Sequalize 打包後的物件，多包裝了幾層，並且裡面加上一些 Sequalize 內建的參數與方法，讓我們可以直接透過 Sequalize 操作這筆資料，例如刪除user.delete()或 更新user.date(...) 或簡化user.toJSON()
