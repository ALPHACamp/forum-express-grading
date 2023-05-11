const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    try {
      //* 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (password !== passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email } })
      //* 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      //* 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      next(err)
    }
  }
}

module.exports = userController
