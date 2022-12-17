const bcrypt = require('bcryptjs')
const db = require('../models')
const Sequelize = require('sequelize')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 確認密碼與驗證密碼是否相同
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email
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
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        include: [Restaurant],
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('restaurant_id')), 'restaurant_id']],
        order: [
          [{ model: Restaurant }, 'id', 'ASC']
        ],
        distinct: true,
        col: 'restaurant_id',
        raw: true,
        nest: true
      })])
      .then(([user, comments]) => res.render('users/profile', { user, comments: comments.rows, commentCount: comments.count }))
      .catch(err => next(err))
  },
  editUser: (req, res, next) => User.findByPk(req.params.id, { raw: true })
    .then(user => res.render('users/edit', { user }))
    .catch(err => next(err)),
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
