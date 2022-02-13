const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      if (password !== passwordCheck) throw new Error('Password do not match!')
      const user = User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', 'Sign up success!')
      res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '成功登出！')
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const pageUser = await User.findByPk(id, { raw: true })
      if (!pageUser) throw new Error("User didn't exist!")
      res.render('users/profile', { pageUser })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    const id = Number(req.params.id)
    if (id !== req.user.id) return res.redirect(`/users/${req.user.id}/edit`)
    try {
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const id = Number(req.params.id)
    const { name } = req.body
    try {
      if (id !== req.user.id) throw new Error('僅可修改自己的資料！')
      if (!name) throw new Error('User name is required!')
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      const { file } = req
      const filePath = await imgurFileHandler(file)
      await user.update({ name, image: filePath || user.filePath })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = userController
