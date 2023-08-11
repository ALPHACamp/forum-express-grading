const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
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
    const userId = req.params.id
    const currentUser = getUser(req).id
    const userAuthed = (Number(userId) === currentUser) // 驗證使用者是否是本人
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { user_id: userId },
        nest: true,
        raw: true
      })
    ])
      .then(([user, commentResult]) => {
        const commentCount = commentResult.count
        const comments = commentResult.rows
        return res.render('users/profile', { user, userAuthed, commentCount, comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id
    const currentUser = getUser(req).id
    const userAuthed = (Number(userId) === currentUser)
    if (!userAuthed) throw new Error('非使用者本人無法更改資料!')
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.params.id
    const currentUser = getUser(req).id
    const userAuthed = (Number(userId) === currentUser)
    if (!userAuthed) throw new Error('非使用者本人無法更改資料!')
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
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
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
