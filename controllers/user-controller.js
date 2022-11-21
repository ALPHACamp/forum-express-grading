const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // hash() 函式接受兩個參數：第一個參數：一個需要被加密的字串/第二個參數：可以指定要加的鹽或複雜度係數
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({
      where: { email: req.body.email }
    })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 前面加 return，讓這個 Promise resolve 的值可以傳到下一個 .then 裡面，下一個 .then 裡面的參數 hash 就會是加密過後的密碼
      })
      // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '你已成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出!')
    res.redirect('/signin')
  }
}
module.exports = userController
