const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 有輸入值為空白的情況
    if (!name.trim() || !email || !password || !passwordCheck) {
      throw new Error('All fields are required, cannot be blank!')
    }
    // 兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (password !== passwordCheck) {
      throw new Error('Password check is not match with password!')
    }
    User.findOne({ where: { email } })
      .then(user => {
        // Email已經註冊過，就建立一個 Error 物件並拋出
        if (user) {
          throw new Error('Email is already registered!')
        }
        // 都沒錯誤則進行雜湊（必須return，then才會接到）
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_msg', '註冊成功')
        res.redirect('/login')
      })
      .catch(err => next(err, req)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  logInPage: (req, res) => {
    res.render('login')
  },
  logIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },
  logOut: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/login')
  }
}

module.exports = userController
