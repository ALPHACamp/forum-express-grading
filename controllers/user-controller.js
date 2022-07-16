const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    try {
      const foundUser = await User.findByPk(req.params.id, { raw: true })
      if (!foundUser) throw new Error('User is not exist')
      const foundComments = await Comment.findAll({
        include: Restaurant,
        where: { user_id: req.params.id },
        nest: true,
        raw: true
      })
      const commentNumber = foundComments.length || 0
      res.render('users/profile', { user: foundUser, currentUser: req.user, foundComments, commentNumber })
    } catch (error) { next(error) }
  },
  editUser: async (req, res, next) => {
    try {
      const foundUser = await User.findByPk(req.params.id, { raw: true })
      if (!foundUser) throw new Error('User is not exist')
      res.render('users/edit', { user: foundUser })
    } catch (error) { next(error) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Name is required')
      const { file } = req
      const user = await User.findByPk(req.params.id)
      const filePath = await imgurFileHandler(file)
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (error) { next(error) }
  }
}
module.exports = userController
