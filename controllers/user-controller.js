const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res, next) => {
    const { name, email, password } = req.body

    if (password !== req.body.passwordCheck) { throw new Error('Passwords do not match!') }

    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    return res.redirect('/signin')
  }

}

module.exports = userController
