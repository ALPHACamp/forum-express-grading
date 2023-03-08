const bcrypt = require('bcryptjs')
const db = require('../models')
const { Comment, Restaurant, User } = db
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
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'You have been logged in successfully.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'You have been logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      Comment.findAll({
        include: [
          { model: Restaurant }
        ],
        where: { userId },
        nest: true,
        raw: true
      }),
      User.findByPk(userId, { raw: true })
    ])
      .then(([comment, user]) => {
        if (!user) throw new Error('User does not exist.')
        res.render('users/profile', {
          user,
          comment,
          length: comment.length
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(getUser(req).id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User does not exist.')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(getUser(req).id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist.')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${getUser(req).id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
