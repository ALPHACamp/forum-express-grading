const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db
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
    return User.findByPk(req.params.id, { nest: true, raw: true }).then(
      user => res.render('users/profile', user)
    ).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { nest: true, raw: true }).then(
      user => res.render('users/edit-user', user)
    ).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('user name is required!')
    const { file } = req
    Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)]).then(([user, filePath]) => {
      if (!user) throw new Error("User didn't exist!")
      return user.update({
        name,
        image: filePath || user.image
      })
    }).then(user => {
      req.flash('success_messages', 'user was successfully to update')
      res.redirect(`/users/${user.id}`)
    }).catch(err => next(err))
  }
}
module.exports = userController
