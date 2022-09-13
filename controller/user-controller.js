const bcrypt = require('bcryptjs')
const db = require('../models/index')
const { User } = db
const uerController = {

  signupUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res) => {
    const { name, email, password } = req.body
    try {
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      User.create({ name, email, password: hash })
      return res.redirect('/signin')
    } catch (error) {
      console.log(error)
    }
  }

}

module.exports = uerController
