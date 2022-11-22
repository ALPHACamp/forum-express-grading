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
  signUp: (req, res, next) => {
    // 判斷兩次密碼是否相符
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 判斷email是否已註冊
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 若已有使用者，回傳錯誤訊息
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 在這裡return可丟到下一個then函式
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  // 登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
