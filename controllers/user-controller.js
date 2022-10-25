const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant } = db
const { getUser } = require('../helpers/auth-helpers')
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
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAll({
        raw: true,
        nest: true,
        where: { userId: req.params.id },
        include: Restaurant,
        group: 'restaurantId',
        attributes: ['restaurantId']
      })
    ])
      .then(([userProfile, comments]) => {
        if (!userProfile) throw new Error("User didn't exist!")
        res.render('users/profile', { user: getUser(req), userProfile, comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id !== getUser(req).id) throw new Error('Not authorized to access this page')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req
    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
