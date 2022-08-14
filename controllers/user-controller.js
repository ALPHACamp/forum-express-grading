const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-halpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
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
  getUser: async (req, res, next) => {
    const currentUser = getUser(req)
    await User.findByPk(req.params.id, {
      include: [{ model: Comment, include: Restaurant }]
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        user = user.toJSON()
        return res.render('users/profile', { currentUser, user })
      })
      .catch(err => next(err))
  },
  editUser: async (req, res, next) => {
    await User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    const { name } = req.body
    const { file } = req
    await Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name: name || user.name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
