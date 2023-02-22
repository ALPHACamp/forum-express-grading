const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models')
const { removesWhitespace } = require('../helpers/object-helpers')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup', { name: req.flash('name'), email: req.flash('email') })
  },
  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = removesWhitespace(req.body)
    if (!email || !password || !confirmPassword) throw new Error('必填欄位尚未填寫')
    if (password !== confirmPassword) throw new Error('確認密碼輸入的密碼與不一致')
    return User.findOrCreate({
      where: { email },
      defaults: { id: uuidv4(), name, email, password: bcrypt.hashSync(password, 10) }
    })
      .then(([user, created]) => {
        if (!created) return console.log('Email is already existed!')
        req.flash('success_messages', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err, req))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: passport.authenticate('local', {
    failureRedirect: '/signin',
    successRedirect: '/restaurants'
  }),
  logOut: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
