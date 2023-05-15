const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  // 負責render註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 處理註冊行為
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}

module.exports = userController
