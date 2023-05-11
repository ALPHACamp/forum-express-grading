const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res) => {
    try {
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      return res.redirect('/signin')
    } catch (err) {
      res.send(err)
    }
  }
}

module.exports = userController
