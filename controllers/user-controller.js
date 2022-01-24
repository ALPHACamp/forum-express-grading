// 引入模組
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  // 渲染signup頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    // 建立密碼雜湊，並將資料新增至資料庫，最後重新導向signin頁面
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}

// 匯出模組
module.exports = userController
