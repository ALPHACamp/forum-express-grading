// - 處理屬於user路由的相關請求
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // - 驗證表單
    try {
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match')
      }
      const foundUser = await User.findOne({ where: { email } })
      if (foundUser) throw new Error('User already exists!')
      const hash = bcrypt.hashSync(password, 10)
      await User.create({ name, email, password: hash })
      req.flash('success_messages', '註冊成功! 可進行登入了!')
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '已成功登入!')
    return res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.logout(error => {
      if (error) return next(error)
    })
    req.flash('success_messages', '已成功登出!')
    return res.redirect('/signin')
  }
}

module.exports = userController
