const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db // const User = db.User
// const User = require('../models').User
const userController = {
  signUpPage: (req, res) => {
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
