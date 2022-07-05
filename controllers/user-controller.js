const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 若兩次輸入密碼不同，建立一個Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do no match!')

    // 確認資料內有沒有一樣的email，若有就建立一個Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加return，可讓這個promise resolve的值可傳到下一個.then 裡面，下一個.then內參數hash就會是加密後的密碼，此寫法可減少巢狀層級，讓程式碼比較好讀
      })
      .then(hash => User.create({ // 上面錯誤都沒發生, 使用者資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '成功註冊帳號!') // 顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門處理錯誤的 middleware
  }
}
module.exports = userController
