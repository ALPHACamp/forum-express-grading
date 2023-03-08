const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

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
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫 Express 內建的 Error Handler，或自己客製化錯誤處理的 middleware。
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
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("This User didn't exists!")
        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("This User didn't exists!")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.params.id
    const { name } = req.body
    const { file } = req
    if (req.user.id !== Number(userId)) throw new Error('請勿更改他人資料!')
    if (!name.trim()) throw new Error('名字請勿空白')

    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("This User didn't exists!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '編輯成功!')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
