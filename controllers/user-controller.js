const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res, next) => {
    const { name, email, password } = req.body

    if (password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10);
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(error => next(error))
  }
}

module.exports = userController
