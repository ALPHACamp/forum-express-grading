// - 處理屬於user路由的相關請求
const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // - 驗證表單
    try {
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match')
      }
      const foundUser = await User.findOne({ where: { email } })
      if (foundUser) throw new Error('User already exists!')
      const hash = bcrypt.hashSync(password, 10)
      await User.create({ name, email, password: hash })
      req.flash('success_messages', '註冊成功! 可進行登入了!')
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '已成功登入!')
    return res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.logout(error => {
      if (error) return next(error)
    })
    req.flash('success_messages', '已成功登出!')
    return res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, {
        nest: true,
        include: [{ model: Comment, include: [Restaurant] }],
        order: [[Comment, 'created_at', 'DESC']]
      })
      if (!user) throw new Error('使用者不存在!')
      const commentsLength = user.Comments.length
      return res.render('users/profile', { user: user.toJSON(), commentsLength })
    } catch (error) {
      return next(error)
    }
  },
  editUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error('使用者不存在!')
      return res.render('users/edit', { user })
    } catch (error) {
      return next(error)
    }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req
    try {
      if (!name) throw new Error('名稱為必填!')
      const [user, filePath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(file)
      ])
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${user.id}`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController
