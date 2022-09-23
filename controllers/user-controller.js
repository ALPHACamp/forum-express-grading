const bcrypt = require('bcryptjs')
const db = require('../models/index')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = db
const assert = require('assert')
const uerController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      // password 與 passwordCheck有無一致
      if (password !== passwordCheck) throw new Error('Passwrod do not match !')
      // email 有無重複
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      User.create({ name, email, password: hash })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  signInPage: (req, res) => {
    res.render('signIn')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, { raw: true })
      assert(user, "User didn't exist!")
      res.render('users/profile', { user })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, { raw: true })
      assert(user, "User didn't exist!")
      res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { id } = req.params
      const filePath = await imgurFileHandler(req.file)
      const user = await User.findByPk(id)
      assert(user, "User didn't exist!")
      await user.update({ name, image: filePath || null })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  }

}

module.exports = uerController
