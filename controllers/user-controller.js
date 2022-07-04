// FilePath: controllers/user-controllers.js
// Include modules
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// User Controller
const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body

      // Check if password equals passwordCheck
      if (password !== passwordCheck) throw new Error('Passwords does not match Password Check!')

      // Check if email already signed up
      const userFound = await User.findOne({ where: { email } })
      if (userFound) throw new Error('Email already exists!')

      // Create new user
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      req.flash('success_messages', 'Sign up succeed!')
      return res.redirect('/signin')
    } catch (err) { next(err) }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in succeed!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Log out succeed!')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
