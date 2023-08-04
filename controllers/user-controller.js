const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password } = req.body
    bcrypt.hash(password, 10)
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/signin'))
      .catch(err => console.log(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  }
}

module.exports = userController
