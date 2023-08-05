const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
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
    } catch (err) {
      next(err)
    }
  },
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
