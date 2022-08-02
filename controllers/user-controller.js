const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  getSignUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // check if the password confirmation does match
    if (req.body.password !== req.body.passwordCheck) throw new Error('The password confirmation does not match.')
    // check if the email already exists
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        // else store the user register information
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Register successfully! Please login to your account.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  getSignInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'You have successfully logged out.')
    req.logout()
    res.redirect('/signin')
  }
}
module.exports = userController
