const bcrypt = require('bcryptjs')
const { User } = require('../models')

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
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { nest: true, raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        const createdDate = user.createdAt.toJSON().split('T')[0]
        const updatedDate = user.updatedAt.toJSON().split('T')[0]
        res.render('users/profile', { user, createdDate, updatedDate })
      })
      .catch(err => next(err))
  },
  putUser: (req, res) => {

  },
  editUser: (req, res) => {

  }

}

module.exports = userController
