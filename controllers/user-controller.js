const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      // 若前後密碼不一致
      if (req.body.password !== req.body.passwordCheck) throw new Error("Passwords don't match")
      const findUser = await User.findOne({ where: { email: req.body.email } })
      // 若Email已註冊
      if (findUser) {
        throw new Error('Email already exists!')
      }

      const passwordHash = await bcrypt.hash(req.body.password, 12)
      const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      })
      if (createUser) {
        req.flash('success_msg', 'Succeed in registering.')
        res.redirect('/signin')
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
