const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // hash() 函式接受兩個參數：第一個參數：一個需要被加密的字串/第二個參數：可以指定要加的鹽或複雜度係數
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
