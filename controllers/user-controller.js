const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  // 導向註冊頁
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 註冊功能
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return 傳到下一個 then
      })
      .then(hash =>
        User.create({
          // 寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  // 導向登入頁
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 登入功能
  signIn: (req, res) => {
    // 在 routes/index.js 用 Passport 的 middleware
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出功能
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = userController
