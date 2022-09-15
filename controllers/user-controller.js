const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  // sign up
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords does not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('User has already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_msg', 'Sign up successfully!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  // sign in
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', 'Sign in successfully!')
    res.redirect('/restaurants')
  },
  // sign out
  logout: (req, res, next) => {
    req.flash('success_msg', 'Log out successfully!')
    req.logout(err => {
      if (err) return next(err)
    })
    res.redirect('/signin')
  }
}
module.exports = userController
