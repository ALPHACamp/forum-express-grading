const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const user = req.body
    bcrypt.hash(user.password, 10)
      .then(hash => User.create({
        name: user.name,
        email: user.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
