const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const userController = {
  singUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼與確認密碼不一致!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('使用者已存在!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '註冊成功!')
        res.redirect('/signin')
      })
      .catch(error => next(error))
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
