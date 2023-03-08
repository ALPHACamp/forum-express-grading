const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { getUser } = require('../helpers/auth-helper')

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res, next) => {
    const { name, email, password } = req.body

    if (password !== req.body.passwordCheck) { throw new Error('Passwords do not match!') }

    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    return res.redirect('/signin')
  },

  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(error => next(error))
  },

  editUser: (req, res, next) => {
    return User.findByPk(getUser(req).id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(error => next(error))
  },

  putUser: (req, res, next) => {
    const { file } = req
    const { name } = req.body

    return Promise.all([
      User.findByPk(req.user.id),
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
        return res.redirect(`/users/${req.user.id}`)
      })
      .catch(error => next(error))
  }

}

module.exports = userController
