const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment } = require('../models')
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
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
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
      Comment.findAll({
        raw: true,
        nest: true,
        include: Restaurant,
        where: { userId: req.params.id },
        attributes: ['restaurantId'],
        group: 'restaurantId'
      }),
      User.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
    ])
      .then(([comments, userProfile]) => {
        if (!userProfile) throw new Error("User doesn't exist.")

        res.render('users/profile', {
          user: getUser(req),
          userProfile,
          comments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(userProfile => {
        if (!userProfile) throw new Error("User doesn't exist.")
        res.render('users/edit', { user: userProfile })
      })
      .catch(e => next(e))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Name is required!')

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([user, imagePath]) => {
        return user.update({
          name,
          image: imagePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
