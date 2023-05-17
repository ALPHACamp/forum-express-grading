const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match!')
      }
      // 確認 email 是否已註冊，如有就建立一個 Error 物件並拋出
      const user = await User.findOne({ where: { email } })

      if (user) {
        throw new Error('Email already exists!')
      }

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
      res.redirect('/signin')
    } catch (e) {
      next(e)
    } // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
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
