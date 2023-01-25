const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUppage: (req, res) => {
    res.render('singup')
  },
  signUp: (req, res) => {
    const { name, email, password } = req.body
    bcrypt
      .hash(password, 10)
      .then(hash => {
        return User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
