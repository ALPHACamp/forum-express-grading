// - 處理屬於user路由的相關請求
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, 10)
    await User.create({ name, email, password: hash })
    return res.redirect('/signin')
  }
}

module.exports = userController
