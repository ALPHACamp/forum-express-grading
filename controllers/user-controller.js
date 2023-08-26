const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')

const { localFileHandler, defaultAvatarPath } = require('../helpers/file-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.passwordCheck !== req.body.password) throw new Error('Password do not match')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      )
      .then(() => {
        req.flash('success_messages', '註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        if (!user.image) {
          user.image = defaultAvatarPath // 指定預設頭貼
        }
        return res.render('users/profile', { user: user.toJSON() })
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        // if (user.id !== req.user.id) throw new Error('請勿修改他人資料')
        return res.render('users/edit', { user })
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name, email } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在')
        // if (user.id !== req.user.id) throw new Error('請勿修改他人資料')
        return user.update({
          name,
          email,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }

}

module.exports = userController
