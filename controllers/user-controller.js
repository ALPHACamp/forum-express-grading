const bcrypt = require('bcryptjs')
const assert = require('assert')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant } = require('../models')
const helpers = require('../helpers/auth-helpers')

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
        req.flash('success_messages', 'Signup successfully!')
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
    const userId = req.params.id
    const reqUser = helpers.getUser(req) // 滿足測試檔所增加的
    const checkUser = (Number(userId) === reqUser.id)
    return Promise.all([
      User.findByPk(userId),
      // 也可以分開用 finAll 和 count 來完成計數
      Comment.findAndCountAll({
        include: Restaurant,
        where: {
          ...userId ? { userId } : {}
        },
        raw: true,
        nest: true
      })
    ])
      // { rows } 顯示下一層內容，不會只返回[object]，{ count } 計算數量。
      .then(([user, { rows: comments, count: totalComments }]) => {
        assert(user, "User didn't exist!")
        return res.render('users/profile', { user: user.toJSON(), comments, totalComments, checkUser })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const reqUser = helpers.getUser(req) // 滿足測試檔所增加的
    return User.findByPk(req.params.id)
      .then(user => {
        assert.equal(user.id, reqUser.id, 'Only can update your own profile!')
        assert(user, "User didn't exist!")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    assert(name, 'User name is required!')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        assert.equal(user.id, req.user.id, 'Only can update your own profile!')
        assert(user, "User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
