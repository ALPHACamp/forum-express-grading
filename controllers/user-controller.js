const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
  // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      // 確認資料庫內沒有一樣的email
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      // 若上面的錯誤皆沒發生，創建使用者
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
