const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const salt = await bcrypt.genSalt(5)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })
      return res.redirect('/signin')
    } catch (err) {

    }
  }
}

module.exports = userController
