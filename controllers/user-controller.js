const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    // 驗證：兩次密碼不同就回傳 Error
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Password do not match')
    }
    // 驗證：這個email還沒有被註冊，已經有的話回傳 Error
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
        console.log('signin')
        res.redirect('/signin')
      })
      .catch(err => {
        console.log('catch error')
        next(err)
      }) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    console.log('POST SignIn')
    if (req.flash) {
      req.flash('success_messages', 'Sign in successfully.')
    }
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully.')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
