// 載入 bcrypt
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    // 可以去查詢genSalt與hash的使用以及差異
    bcrypt
      .hash(req.body.password, 10)
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
