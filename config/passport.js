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
    passReqToCallback: true // 把 req pass 給 callback (下面那個)
  },
  // authenticate user
  // 這個就是上面提到的 callback
  (req, email, password, cb) => { // cb 則是這函式準備的 callback Fn.，就是官方文件的 .done()，傳驗證的結果
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // (上1) cb 的三個引數, 1. 是否有錯(沒錯放 null) 2. 使用者資訊(有的話就放 user) 3. 若有錯誤，可在這擺額外資訊
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          // '帳號或密碼輸入錯誤！' --> 訊息刻意一樣，增加攻擊難度
          return cb(null, user)
        })
      })
  }
))
// serialize and deserialize user
// 好處，session 記憶體用量變小，壞處，須更頻繁與 DB 聯繫，取資料
passport.serializeUser((user, cb) => {
  // 序列化，把 session 訊息編碼到只剩 id，減少記憶體使用量
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  // 反序列化，還原，用 id 找到使用者的物件實例並使用
  User.findByPk(id).then(user => {
    user = user.toJSON() // 雖然改成 plain object，但暫時不知原因
    return cb(null, user)
  })
})
module.exports = passport
