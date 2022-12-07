const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => { // 修改這裡
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
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
    const userId = getUser(req).id
    if (userId !== Number(req.params.id)) throw new Error('Permission denied!')
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: [Restaurant],
        nest: true,
        where: { userId: req.params.id }
      })
    ])
      .then(([user, comments]) => {
        res.render('users/profile', { user, comments })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    const userId = getUser(req).id
    if (userId !== Number(req.params.id)) throw new Error('Permission denied!')
    return User.findByPk(userId, { raw: true })
      .then(user => {
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const userId = req.user.id
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('User name is required!')
    if (userId !== Number(req.params.id)) throw new Error('Permission denied!')
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filepath]) => {
        return user.update({
          name,
          avatar: filepath || user.avatar
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
