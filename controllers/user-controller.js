const bcrypt = require('bcrypt')
const { Restaurant, Comment, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼不一致')
    User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) throw new Error('用戶已存在')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success', '註冊成功')
        res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success', '登入成功')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.logout(() => {
      req.flash('success', '登出成功')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    // const userId = req.user.id;
    return Promise.all([
      User.findByPk(id, {
        include: { model: Comment, include: Restaurant }
      }),
      Comment.findAndCountAll({
        where: { userId: id },
        raw: true
      })
    ])

      .then(([user, comment]) => {
        if (!user) throw new Error("User didn't exist")
        return res.render('users/profile', { user: user.toJSON(), comment })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    // const userId = req.user.id;
    return User.findByPk(id, { raw: true }).then(user => {
      if (!user) throw new Error("User didn't exist")
      // if (user.id !== userId) throw new Error("無法更改他人資料");
      return res.render('users/edit', { user })
    })
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const userId = req.user.id
    if (!name) throw new Error('User name is required')
    const id = Number(req.params.id)
    const file = req.file
    return Promise.all([User.findByPk(id), localFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist")
        if (user.id !== userId) throw new Error('無法更改他人資料')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
