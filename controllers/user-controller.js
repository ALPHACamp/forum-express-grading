const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password } = req.body
    bcrypt.hash(password, 10)
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
