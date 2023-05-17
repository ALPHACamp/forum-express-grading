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
      if (req.body.password !== req.body.passwordCheck) throw new Error('Password dot not match!')

      const user = await User.findOne({ where: { email: req.body.email } })

      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      next(err)
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
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      // 反查user 確認user是否存在
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      // 檢查user.id / req.user.id
      if (req.user) {
        if (user.id !== req.user.id) {
          return res.redirect(`/users/${req.user.id}`)
        }
      }
      res.render('users/profile', { user: user.toJSON() })
    } catch (err) { next(err) }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      // 檢查user.id / req.user.id
      if (req.user) {
        if (user.id !== req.user.id) {
          return res.redirect(`/users/${req.user.id}/edit`)
        }
      }
      res.render('users/edit', { user: user.toJSON() })
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      const { file } = req

      const [user, filePath] = await Promise.all([User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])

      if (!user) throw new Error("User didn't exist!")
      if (user.id !== req.user.id) throw new Error("User can't modify others profile")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')

      res.redirect(`/users/${user.id}`)
    } catch (err) { next(err) }
  }
}

module.exports = userController
