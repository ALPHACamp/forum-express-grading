const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  singUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if(password !== passwordCheck) throw new Error('Password do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if(user) throw new Error('Email already exist!')

        return bcrypt.hash(password, 10)
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
      .catch(err => next(err))
  }
}

module.exports = userController
