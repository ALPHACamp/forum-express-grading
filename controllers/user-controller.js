const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 如果有空欄，丟錯誤
    if (!name || !email || !password || !passwordCheck) {
      throw new Error('All fields are required.')
    }
    // 如果密碼不同，丟錯誤
    if (password !== passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    // 如果email已存在，丟錯誤
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  }
}
module.exports = userController
