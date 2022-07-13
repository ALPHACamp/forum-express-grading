const bcrypt = require('bcryptjs')
const { Comment, User, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
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
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
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
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant, // 拿出關聯的 Category model
        nest: true,
        raw: true,
        where: { user_id: id }
      })
    ])
      .then(([user, comment]) => {
        if (!user) throw new Error("user didn't exist!")
        const restaurants = comment.rows.map(r => r.Restaurant)
        return res.render('users/profile', { user, comment, restaurants })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const id = req.params.id
    const canEdit = req.user.id === Number(id)
    if (!canEdit) {
      req.flash('error_messages', '禁止編輯他人資料')
      return res.redirect(`/users/${id}`)
    }
    const { name } = req.body
    const { file } = req
    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("user didn't exist!")
        return user.update({ name: name || user.name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
