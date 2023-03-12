const bcrypt = require('bcryptjs')
// 有點在意和db連線和使用model的部分
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const UserController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  singUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/singin')
      })
      .catch(err => next(err))
  },
  singInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then(user => {
        res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    res.render('users/edit')
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([
      User.findByPk(req.user.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => user.update({
        name,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'profile was successfully updated')
        res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = UserController
