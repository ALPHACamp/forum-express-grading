const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  // 負責 render 註冊的頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 負責實際處理註冊的行為
  signUp: (req, res) => {
    // 透過 bcrypt 使用雜湊演算法，把使用者密碼轉成暗碼，再存入資料庫裡面
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
