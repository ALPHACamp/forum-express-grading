const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password !== passwordCheck) throw new Error('Passwords do not match')
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already Exists')

      const salt = await bcrypt.genSalt(5)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })
      req.flash('success_messages', '成功註冊帳號')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
