const bcrypt = require('bcryptjs')
const db = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
module.exports = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
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
      .catch(err => next(err))// 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
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
    const id = req.params.id
    const user = getUser(req)
    return User.findByPk(id)
      .then(viewUser => {
        if (!viewUser) throw new Error('User is not exist!')
        res.render('users/profile', { user, viewUser: viewUser.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        if (user.id !== getUser(req).id) throw new Error('Permission denied!')
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    return Promise.all(
      [
        User.findByPk(id),
        imgurFileHandler(req.file)
      ]
    )
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist!')
        if (req.user.id !== user.id) throw new Error('Permission denied!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}
