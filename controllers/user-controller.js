const bcrypt = require('bcryptjs')// 載入bcrypt
const db = require('../models')
const { User, Restaurant, Comment } = db
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
    const loginUseruId = req.user ? Number(req.user.id) : ''
    return Promise.all([
      User.findByPk(req.params.id, {
        include: [
          { model: Comment, include: Restaurant }
        ],
        nest: true

      }),
      User.findByPk(loginUseruId, {
        raw: true
      })

    ])
      .then(([user, loginUser]) => {
        const commentTimes = req.user ? user.Comments.length ? user.Comments.length : 0 : ''
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user: user.toJSON(), loginUser, commentTimes })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.user ? req.user.id : req.params.id
    if (req.user && Number(req.user.id) !== Number(req.params.id)) {
      req.flash('warning_messages', '小壞蛋！只能改自己的！')
      res.redirect('/users/' + userId)
    }
    return User.findByPk(userId, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User didn\'t exist')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect('/users/' + req.params.id)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
