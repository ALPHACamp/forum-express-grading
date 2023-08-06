const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  // render sign up page
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // sign up
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController