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
    User.findOne({ where: { email: userInput.email } })
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
        req.flash('success_msg', 'register account successfully')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // catch error above and call error-handler middleware
  }
}
module.exports = userController
