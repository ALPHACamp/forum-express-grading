const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => res.render('signUp'),
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
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
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout(err => {
      if (err) return next(err)
      res.redirect('/signIn')
    })
  }
}

module.exports = userController
