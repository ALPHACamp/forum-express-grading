const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  // 進入註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 註冊功能
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
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
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  // 進入登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 登入功能
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出功能
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
