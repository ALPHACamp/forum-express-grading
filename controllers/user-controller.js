const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 兩組密碼不相同，就建立Error物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('兩個密碼不相同')
    // 比對user內的信箱是否一樣，如一樣就建立Error物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('信箱已經註冊過！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success.message', '成功註冊帳號！')
        res.redirect('/signin')
      })
      // 接住前面的錯誤，呼叫專門處理錯誤的middleware
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
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = userController
