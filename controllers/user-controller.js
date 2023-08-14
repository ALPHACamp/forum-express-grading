const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  // 導向註冊頁
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 註冊功能
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    // 確認資料裡面沒有一樣的 email
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return 傳到下一個 then
      })
      .then(hash =>
        User.create({
          // 寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  // 導向登入頁
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 登入功能
  signIn: (req, res) => {
    // 在 routes/index.js 用 Passport 的 middleware
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出功能
  logout: (req, res, next) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  // 取得使用者
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { user_id: userId },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        res.render('users/profile', {
          user,
          count: comments.count,
          comments: comments.rows
        })
      })
      .catch(err => next(err))
  },
  // 編輯使用者
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('Name is required!')
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '不能更改!')
      res.redirect('/restaurants')
    }

    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name,
          image: filePath || user.image
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
