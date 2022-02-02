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
      if (password !== passwordCheck) throw new Error('Password do not match!')
      const user = User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', 'Sign up success!')
      res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  }
}
module.exports = userController
