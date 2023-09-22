const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const userInput = req.body
    // if two password different, establish a new error
    if (userInput.password !== userInput.passwordCheck) throw new Error('Password do not match!')
    // confirm whether email das exist, throw error if true
    return User.findOne({ where: { email: userInput.email } })
      .then(user => {
        if (user) throw new Error('Email already exist')
        return bcrypt.hash(userInput.password, 10)
      })
      .then(hash => User.create({
        name: userInput.name,
        email: userInput.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'register account successfully')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // catch error above and call error-handler middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res) => {
    res.redirect('users/profile')
  }
}
module.exports = userController
