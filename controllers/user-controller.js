const bcrypt = require('bcryptjs')
const User = require('../models').User

const userController = {
  getSignUpPage (_req, res) {
    res.render('signup')
  },
  signUp (req, res) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.render('/signin'))
  }
}

module.exports = userController
