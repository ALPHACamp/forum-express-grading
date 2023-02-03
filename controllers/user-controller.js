const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const userController = {
  singUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
      .catch(error => console.log(error))
    }
}

module.exports = userController
