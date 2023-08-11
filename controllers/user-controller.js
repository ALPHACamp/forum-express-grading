const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('兩次密碼輸入不同！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('信箱重複！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ name: req.body.name, email: req.body.email, password: hash }))
      .then(() => {
        req.flash('success_msg', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
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
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('找不到使用者！')

        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('找不到使用者！')

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body

      if (!name) throw new Error('名稱為必填！')

      const { file } = req

      const [user, filePath] = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      console.log(user)

      if (!user) throw new Error('找不到使用者！')

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '成功更新使用者資料！')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
