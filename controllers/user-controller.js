const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    const { file } = req
    if (password !== passwordCheck) throw new Error('密碼與驗證密碼不相同')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email已註冊過')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return imgurFileHandler(file).then(filePath => {
          User.create({
            name,
            email,
            password: hash,
            image: filePath || null
          })
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    /*
      logout現在是非同步，需要有一個callback func才能正確執行
      所以在這加入err來處理錯誤
    */
    req.logout(err => {
      if (err) return next(err)
      req.flash('success_messages', '登出成功')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { userId: req.params.id },
        include: Restaurant
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('查無使用者資料')

        const count = comments.count
        const set = new Set()
        const filterComments = comments.rows.filter(comment =>
          !set.has(comment.Restaurant.id)
            ? set.add(comment.Restaurant.id)
            : false
        )
        const restCount = filterComments.length
        const currentComments = filterComments.map(comment => ({
          ...Comment,
          restaurantId: comment.Restaurant.id,
          restaurantImage: comment.Restaurant.image
        }))
        res.render('users/profile', {
          user: user.toJSON(),
          restCount,
          count,
          comments: currentComments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('查無該使用者')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('名稱為必填欄位')
    const { file } = req
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error('查無該使用者資料')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
  }
}

module.exports = userController
