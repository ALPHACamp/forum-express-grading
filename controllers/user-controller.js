const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
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

  // 不知道為什麼使用以下 promise 寫法跑 test 明明同樣的程式碼，有時候pass 有時候 Error: Timeout of 2000ms exceeded.
  // 後來將 Timeout 等久一點就正常了，不知道是不是電腦太舊跑太慢？
  getUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    const { file } = req
    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("user didn't exist!")
        return user.update({ name: name || user.name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
