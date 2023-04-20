const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  // 註冊頁面
  signUpPage: (req, res) => res.render('signup'),
  // 註冊功能
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => res.redirect('/signin'))
  }
}
module.exports = userController
