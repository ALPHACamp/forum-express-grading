const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const UserController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    //  如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('password do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        console.log(req.body.email)
        if (user) throw new Error('Email already exist!') // 若用此email註冊的user已存在，建立一個Error物件並拋出
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}

module.exports = UserController
