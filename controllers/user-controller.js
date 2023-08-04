const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Restaurant, Comment } = db

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      return res.render('signup')
    } catch (error) {
      return next(error)
    }
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hashSync(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', 'register success!')
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },

  signInPage: async (req, res, next) => {
    try {
      return res.render('signin')
    } catch (error) {
      return next(error)
    }
  },

  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      return res.redirect('/restaurants')
    } catch (error) {
      return next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const [user, comments] = await Promise.all([
        User.findByPk(req.params.id, { raw: true }),
        Comment.findAll({
          raw: true,
          nest: true,
          where: { userId: req.params.id },
          include: Restaurant
        })
      ])

      if (!user) throw new Error("User doesn't exists!")

      return res.render('users/profile', { user, comments })
    } catch (error) {
      return next(error)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true
      })

      if (!user) throw new Error("User doesn't exists!")

      return res.render('users/edit', { user: user })
    } catch (error) {
      return next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { file } = req
      if (!name) throw new Error('User name is required!')

      const [user, filePath] = await Promise.all([
        User.findByPk(req.user.id),
        imgurFileHandler(file)
      ])

      if (!user) throw new Error("User doesn't exists!")
      if (Number(req.user.id) !== Number(req.params.id)) throw new Error('Edit self profile only!')

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${req.params.id}`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController
