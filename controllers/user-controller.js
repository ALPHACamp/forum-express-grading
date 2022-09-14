const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => res.render('signUp'),
  signUp: (req, res) => {
    const { name, email, password } = req.body
    return User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    }).then(() => res.redirect('/signin'))
  }
}

module.exports = userController
