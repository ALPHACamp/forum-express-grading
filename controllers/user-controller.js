const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 加 return 讓這個 Promise resolve 的值可以傳到下一個 .then 裡面
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInpPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入。')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出。')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    // 需要：餐廳的img id，userid
    const userId = req.params.id
    return User.findByPk(userId, { include: { model: Comment, include: Restaurant, nest: true } })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.params.id
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('User name is required!')
    if (req.user.id !== Number(userId)) {
      req.flash('error_messages', '')
      res.redirect('/restaurants')
    }
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
