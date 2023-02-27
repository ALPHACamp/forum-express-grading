const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // password not match
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // confirm Email exist or not
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        // else
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        // no error, then use hash pwd to create user model
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        // success message
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    // 當userController.signIn收到 request ，就一定是登入後的使用者，所以這邊沒有驗證邏輯
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
