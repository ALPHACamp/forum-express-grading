const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => { // 負責 render 註冊的頁面
    res.render('signup')
  },
  signUp: (req, res) => { // 處理實際註冊行為
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.render('/signin')
      })
  }
}

module.exports = userController
