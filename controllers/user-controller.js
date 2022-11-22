const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt
      // 用到req.body，所以別忘了使用body-parser，不然會Error:Cannot read property of undefined
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
