const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      console.log('Password check is not match with password')
      return res.render('signup', { name, email, password, passwordCheck })
    }

    bcrypt.hash(password, 10)
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/signin'))
      .catch(err => console.log(err))
  }
}

module.exports = userController
