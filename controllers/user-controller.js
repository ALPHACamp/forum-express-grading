const bcrypt = require('bcryptjs')
// const user = require('../models/user') output=>[Function (anonymous)]
// const db = require('../models')
const { User } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    // console.log(db)
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}

module.exports = userController
