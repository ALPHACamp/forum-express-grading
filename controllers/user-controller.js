const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼與驗證密碼不相同')
    User.findOne({ where: { email } })
      .then((user) => {
        if (user) throw new Error('Email已註冊過')
        return bcrypt.hash(password, 10)
      })
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '帳號註冊成功')
        res.redirect('/signin')
      })
      .catch((err) => next(err))
  }
}

module.exports = userController
