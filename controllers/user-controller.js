const bcrypt = require('bcryptjs')
// 先取出model中的User(資料表格式?)
const db = require('../models')
const { User } = db

const userController = {
  // render 註冊的頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 負責實際處理註冊的行為
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
