const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
