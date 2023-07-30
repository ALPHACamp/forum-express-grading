const bcrypt = require('bcryptjs')
// const db = require('../models')
// const User = db.User
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      const user = await User.findOne({ where: { email } })
      if (user) { throw new Error('Email already exists!') }
      if (password !== passwordCheck) throw new Error('passwords do not match')
      const { file } = req
      const filePath = await imgurFileHandler(file)
      const passwordSalt = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: passwordSalt,
        image: filePath || null
      })
      req.flash('success_messages', '成功註冊帳號')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
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
