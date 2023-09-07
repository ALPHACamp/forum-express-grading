const bcrypt = require('bcryptjs')
const User = require('../models').User

const userController = {
  getSignUpPage (_req, res) {
    res.render('signup')
  },
  signUp (req, res, next) {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Password do not match')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email is already used')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號')
        res.render('signin')
      })
      .catch(err => next(err))
  },
  getSignInPage (_req, res) {
    res.render('signin')
  },
  signin (req, res) {
    req.flash('success_message', '登入成功')
    res.redirect('/restaurants')
  },
  logout (req, res) {
    req.flash('success_message', '登出成功')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
