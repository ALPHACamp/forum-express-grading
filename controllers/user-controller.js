const { User } = require('../models') // function named User
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // (password, salt or salt rounds)
        // then 這邊有 return bcrypt.hash...執行的結果，後面用 then hash 承接，此種方法可以提高閱讀性，避免巢狀層級
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號 請重新登入!')
        res.redirect('/signin')
      })
      .catch(error => next(error)) // 前往 express 內建 error handler middleware
  }
}

module.exports = userController
