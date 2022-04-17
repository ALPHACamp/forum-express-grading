const bcrypt = require('bcryptjs')
// const user = require('../models/user') output=>[Function (anonymous)]
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => { // 負責 render 註冊的頁面
    res.render('signup')
  },
  signUp: (req, res, next) => { // 負責實際處理註冊
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 加了一個return ，讓這個 Promise resolve 的值可以傳到下一個 .then 裡面
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 呼叫 next() 並傳入 err 當作參數的寫法，會觸發 Express 內建的 Error Handler 。在此我們接住前面拋出的錯誤，造呼叫專門做錯誤處理的customized middleware (error-handlebar)
  }
}

module.exports = userController
