const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      // if password not match passwordCheck
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      // if email exist
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      // if everything is fine
      const hash = bcrypt.hashSync(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', 'Account register successfully!')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout(err => {
      if (err) return next(err)
    })
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/profile', { user })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      const { file } = req
      const filePath = await imgurFileHandler(file)
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
