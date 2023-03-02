const bcrypt = require('bcryptjs')
// 有點在意和db連線和使用model的部分
const db = require('../models')
const { User } = db

const UserController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/singin')
      })
      .catch(err => next(err))
  }
}
module.exports = UserController
