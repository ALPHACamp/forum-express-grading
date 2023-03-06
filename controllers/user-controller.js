const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // password not match
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // confirm Email exist or not
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        // else
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        // no error, then use hash pwd to create user model
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        // success message
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    // 當userController.signIn收到 request ，就一定是登入後的使用者，所以這邊沒有驗證邏輯
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
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id

    if (Number(getUser(req).id) !== Number(userId)) throw new Error('you dont have permission to edit this page')
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.params.id
    const { file } = req
    const { name } = req.body
    if (!name) throw new Error('User name is required!')

    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
