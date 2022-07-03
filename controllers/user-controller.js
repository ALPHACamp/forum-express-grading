const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼與密碼確認不相符！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('此 email 已經被使用！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '帳號註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}
module.exports = userController
