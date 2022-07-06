const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      // if password not match passwordCheck
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      // if email exist
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      // if everything is fine
      const hash = bcrypt.hashSync(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', 'Account register successfully!')
      res.redirect('/signup')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
