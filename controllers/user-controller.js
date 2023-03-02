const bcrypt = require('bcryptjs')
// 有點在意和db連線和使用model的部分
const db = require('../models')
const { User } = db

const UserController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/singin')
      })
  }
}
module.exports = UserController
