const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, password, email } = req.body
    bcrypt.hash(password, 10)
      .then(hash => {
        User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => {
        return res.redirect('/signin')
      })
  }
}

module.exports = userController
