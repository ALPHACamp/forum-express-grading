const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User, Comment, Restaurant } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 如果有空欄，丟錯誤
    if (!name || !email || !password || !passwordCheck) {
      throw new Error('All fields are required.')
    }
    // 如果密碼不同，丟錯誤
    if (password !== passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    // 如果email已存在，丟錯誤
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name,
        email,
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
    req.flash('success_messages', '你已成功登入。')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '你已成功登出。')
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        user = user.toJSON()
        if (!user) throw new Error("User didn't exist.")
        user.editable = Number(req.params.id) === user.id
        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const name = req.body.name
    const id = req.params.id
    if (!name) throw new Error('Name is required.')
    const { file } = req
    return Promise.all([
      imgurFileHandler(file),
      User.findByPk(id)
    ])
      .then(([filePath, user]) => {
        if (!user) throw new Error("User didn't exist.")
        if (Number(req.user.id) !== user.id) throw new Error('沒有權限')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
