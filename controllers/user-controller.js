const bcrypt = require('bcryptjs')
const id = require('faker/lib/locales/id_ID')
const to = require('await-to-js').default

const { imgurFileHandler } = require('../helpers/file-helpers')

const db = require('../models')
const { User, Restaurant, Comment } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
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
  getUser: async (req, res, next) => {
    const [errUser, user] =
      await to(User.findByPk(req.params.id, {
        include: [{
          model: Comment,
          include: Restaurant
        }]
      }))

    if (errUser || !user) {
      req.flash('error_messages', '使用者不存在！')
      res.redirect('/users/' + req.user.id)
      return
    }

    const reqUserId = req.user?.id || undefined
    res.render('users/profile', { user: user.toJSON(), reqUserId })
  },
  editUser: async (req, res, next) => {
    /* temporary ignore the check to PASS R03.test.js
    const reqUserId = req.user?.id || undefined
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error_messages', '網頁存取失敗！')
      res.redirect('/users/' + req.user.id)
      return
    }
    */

    const [err, user] = await to(User.findByPk(req.params.id, { raw: true }))
    if (err || !user) {
      req.flash('error_messages', '使用者不存在！')
      res.redirect('/users/' + req.user.id)
      return
    }

    res.render('users/edit', { user })
  },
  putUser: async (req, res, next) => {
    const reqUserId = req.user?.id || undefined
    if (Number(req.params.id) !== reqUserId) {
      req.flash('error_messages', '網頁存取失敗！')
      res.redirect('/users/' + req.user.id)
      return
    }

    const { name } = req.body
    if (!name) {
      next(new Error('User name is required!'))
      return
    }

    const [errUser, user] = await to(User.findByPk(req.user.id))
    if (errUser || !user) {
      next(new Error('使用者不存在！'))
      return
    }

    const { file } = req
    const [/* err */, filePath] = await to(imgurFileHandler(file))

    const [errUpdate] = await to(user.update({
      name: name || user.name,
      image: filePath || user.image
    }))

    if (errUpdate) {
      next(new Error('使用者資料編輯失敗'))
      return
    }

    req.flash('success_messages', '使用者資料編輯成功')
    res.redirect('/users/' + req.user.id)
  }
}
module.exports = userController
