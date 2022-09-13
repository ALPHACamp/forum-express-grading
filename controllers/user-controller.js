const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const UserController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.name,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}

module.exports = UserController
