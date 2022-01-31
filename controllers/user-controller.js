const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Passwords do not match')

    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
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
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const userSession = req.user
    const userId = req.params.id

    return User.findByPk(userId, {
      include: [{ model: Comment, include: [Restaurant] }],
      group: 'Comments->Restaurant.id'
    })
      .then(user => {
        if (!user) throw new Error('User do not exist')
        user = user.toJSON()

        res.render('users/profile', { user, userSession })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = Number(req.params.id)
    // if (Number(userId) !== req.user.id) throw new Error('You can only edit yourself profile')

    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('User do not exist')

        res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error("User's name is required")

    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User don't exist")

        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
