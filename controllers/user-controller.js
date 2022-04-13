const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUP: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const hash = bcrypt.hashSync(password, 10)

      await User.create({
        name,
        email,
        password: hash
      })

      return res.redirect('/signin')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
