const db = require('../models')
const bcrypt = require('bcryptjs')

const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) { throw new Error('Password 跟 Password Check 不一樣!') }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email 已經註冊過了')
        return bcrypt.hash(req.body.password, 10)
      })

      .then(hash => {
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      })
      .catch(err => next(err))
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
