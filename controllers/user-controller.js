// load bcrypt.js
const bcrypt = require('bcryptjs')

// load db
const { User } = require('../models')

// build controller
const userController = {
  // build signupPage and signup
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    const hashSalt = bcrypt.genSaltSync(10)

    console.log(bcrypt.hashSync('qwe', '$2a$10$8/zZ3rig2Z0fVKDHV784.u'))
    bcrypt.hash(password, hashSalt)
      .then(password =>
        User.create({
          name,
          email,
          password
        })
      )
      .then(() => res.redirect('/users/signin'))
  }

}

// exports controller
exports = module.exports = userController
