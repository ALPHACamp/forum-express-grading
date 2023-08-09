const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { PROFILE_DEFAULT_AVATAR, imgurFileHandler } = require('../helpers/file-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email is already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        image: PROFILE_DEFAULT_AVATAR
      }))
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },
  // 這邊的登入驗證在總路由的passport做
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([User.findByPk(req.params.id), Comment.findAndCountAll({
      nest: true,
      where: { userId: req.params.id },
      include: Restaurant
    })
    ])
      .then(([user, comment]) => {
        if (!user) throw new Error("Profile didn't exist")
        const restaurants = comment.rows.map(item => item.Restaurant.toJSON())
        res.render('users/profile', { user: user.toJSON(), restaurants, commentCount: comment.count })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("Profile didn't exist")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const name = req.body.name
    const userId = req.user.id
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }

}

module.exports = userController
