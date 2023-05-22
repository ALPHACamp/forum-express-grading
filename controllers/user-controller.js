const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
const userController = {
  // 註冊頁面
  signUpPage: (req, res) => res.render('signup'),
  // 註冊功能
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email has already exit!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  // 登入頁
  signInPage: (req, res) => res.render('signin'),
  // 登入功能
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出功能
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // 瀏覽使用者個人頁面
  getUser: (req, res, next) => {
    const id = req.params.id
    const userId = req.user?.id || id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        // 確認是否為該user
        const signInUserId = Number(id) === userId
        return res.render('users/profile', { user, signInUserId })
      })
      .catch(err => next(err))
  },
  // 瀏覽使用者編輯頁面
  editUser: (req, res, next) => {
    const id = req.params.id
    const userId = req.user?.id || id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        // 確認是否為該user
        if (Number(id) !== userId) throw new Error('You are not the user!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // 編輯使用者個人頁面功能
  putUser: (req, res, next) => {
    const id = req.params.id
    const userId = req.user?.id || id
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        // 確認是否為該user
        if (Number(id) !== userId) throw new Error('You are not the user!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
