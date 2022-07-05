const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) { throw new Error('Password does not match') }

    User.findOne({ email }).then(user => {
      if (user) throw new Error('This email has been registered.')
      return bcrypt.hash(password, 10)
    })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signup successfully!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
