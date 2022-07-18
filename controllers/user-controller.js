const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helper')
const Sequelize = require('sequelize')
const { raw } = require('express')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) { throw new Error('Password does not match') }

    User.findOne({ where: { email } }).then(user => {
      if (user) throw new Error('This email has been registered.')
      return bcrypt.hash(password, 10)
    })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signup successfully!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      nest: true,
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        user = user.toJSON()
        // 針對test所做的調整，測試檔沒有Comments attribute
        const numberOfComments = user.Comments ? user.Comments.length : 0
        res.render('users/profile', { User: { ...user, numberOfComments } })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User does not exist!')

        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    if (!name) throw new Error('Name is required!')

    const { file } = req
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist')

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
