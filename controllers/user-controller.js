// 引入模組
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  // 渲染signup頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    // 若password與passwordCheck不一致，建立一個Error物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 確認資料庫是否有一樣的email，若有建立一個Error物件並拋出
        if (user) throw new Error('Email already exists!')

        // 若無建立密碼雜湊，並將資料新增至資料庫，最後重新導向signin頁面
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號') // 顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  // 渲染signin頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  // 登出路由
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  }
}

// 匯出模組
module.exports = userController
