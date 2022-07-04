// FilePath: controllers/user-controllers.js
// Include modules
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

// User Controller
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res) => {
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    })
    return res.redirect('/signin')
  }
}

module.exports = userController
