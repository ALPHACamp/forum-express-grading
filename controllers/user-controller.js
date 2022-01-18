const bcrypt = require('bcryptjs') //載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => User.create({  //上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') //並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) //接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  }
}
module.exports = userController