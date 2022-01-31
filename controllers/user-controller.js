const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    const sessionUserId = Number(req.user?.id) || req.params.id

    return User.findByPk(req.params.id, {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")

        return res.render('users/profile', { user, sessionUserId })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { id } = req.user || req.params

    const { name } = req.body
    const { file } = req
    console.log(id, name, file)
    if (!name) throw new Error('Name field is required!')

    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist")

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

module.exports = userController
