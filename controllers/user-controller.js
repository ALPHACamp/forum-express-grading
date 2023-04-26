const bcrypt = require('bcryptjs')

const { User } = require('../models')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email: req.body.email }})
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ name: req.body.name, email: req.body.email, password: hash })
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
      req.flash('success_messages', '成功登入！')
      res.redirect('/restaurants')
  },

  signOut: (req, res) => {
    req.logout()
    req.flash('success_messages', '登出成功！')
    res.redirect('/signin')
  },

  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const userId = req.user?.id
      const [user, userOfLogin] = await Promise.all([User.findByPk(id, { raw: true }), User.findByPk(userId, { raw: true })])
      if (!user) throw new Error("User didn't exist!")
      res.render('users/profile', { user, userOfLogin })
    } catch (err) {
      next(err)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const userId = req.user?.id
      // if (id !== userId.toString()) return res.redirect(`/users/${req.params.id}`)
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },

  putUser: async (req, res, next) => {
    try {
      if (!req.body.name) throw new Error('User name is required!')
      const id = req.params.id
      const { file } = req
      const [filePath, user] = await Promise.all([imgurFileHandler(file), User.findByPk(id)])
      if (!user) throw new Error("User didn't exist!")
      await user.update(Object.assign({ image: filePath || user.image }, req.body))
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController