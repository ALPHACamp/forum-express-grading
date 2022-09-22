const bcrypt = require('bcryptjs')
const db = require('../models')
const { Restaurant, Comment, User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const sequelize = require('sequelize')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => res.render('signUp'),
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
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
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout(err => {
      if (err) return next(err)
      res.redirect('/signIn')
    })
  },
  getUser: (req, res, next) => {
    const { id } = req.params // generate profile
    const user = getUser(req) // real user

    return Promise.all([Comment.findAll({
      where: { user_id: id },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('restaurant_id')), 'comments']],
      include: Restaurant,
      nest: true,
      raw: true
    }), User.findByPk(id, { raw: true })])
      .then(([comments, profile]) => {
        if (!profile) throw new Error('使用者不存在')
        res.render('users/profile', { user, profile, comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('名字為必填')
    return Promise.all([imgurFileHandler(file), User.findByPk(id)])
      .then(([filePath, user]) => {
        if (!user) throw new Error('使用者不存在')
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
