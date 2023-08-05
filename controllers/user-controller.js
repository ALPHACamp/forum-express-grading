const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res, next) => {
    try { res.render('signup') } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('兩次密碼輸入不同！')

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('信箱重複！')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ name: req.body.name, email: req.body.email, password: hash })

      req.flash('success_msg', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) { next(err) }
  },
  signInPage: async (req, res, next) => {
    try { res.render('signin') } catch (err) { next(err) }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/restaurants')
    } catch (err) { next(err) }
  },
  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      res.redirect('/signin')
    } catch (err) { next(err) }
  }
}

module.exports = userController
