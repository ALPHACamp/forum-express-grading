const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      res.render('signup', { name, email })
      return console.log('Confirm password is not correct!')
    }
    return User.findOrCreate({
      where: { email },
      defaults: { id: uuidv4(), name, email, password: bcrypt.hashSync(password, 10) }
    })
      .then(([user, created]) => {
        if (!created) return console.log('Email is already existed!')
        req.flash('success_messages', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => console.log(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: [
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    (req, res, next) => {
      req.flash('success_messages', '登入成功')
      res.redirect('/restaurants')
    }
  ],
  logOut: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
