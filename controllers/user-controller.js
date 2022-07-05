const bcrypt = require('bcryptjs')

const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => { // 負責 render 註冊的頁面
    res.render('signup')
  },
  signUp: (req, res, next) => { // 處理實際註冊行為
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!') // 當此錯誤發生時，會跳出這個function

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!') // 當此錯誤發生時，會跳出這個function
        return bcrypt.hash(req.body.password, 10) // 這裡用return是為了讓 .then可以保持在同一層
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '已成功註冊帳號，請登入後使用！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // next是指呼叫下一個middleware
  }
}

module.exports = userController
