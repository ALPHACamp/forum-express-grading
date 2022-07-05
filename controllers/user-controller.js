
// import packages
const bcrypt = require('bcryptjs')

// import models
const db = require('../models')
const { User }= db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error(`password and passwordCheck don't match!`)

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error(`This email has been register! Please use another one.`)

        // throw out async event & make .then at same level
        // return 'hash' to next .then
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Successfully sign up! Now you are able to use this website.')
        res.redirect('/signin')
      })
      .catch(error => next(error))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully sign in!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Successfully log out!')
    // log out = server will clear session
    req.logout(() => {
      res.redirect('/signin')
    })
  }
}

module.exports = userController