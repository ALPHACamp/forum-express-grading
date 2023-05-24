const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helper/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      // 接住前面拋出的錯誤訊息, 呼叫專門做錯誤處理的 middleware
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      include: [
        {
          model: Comment,
          include: Restaurant
        }
      ]
    })
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        if (req.user) {
          if (user.id !== req.user.id) {
            return res.redirect('/users/' + id)
          }
        }
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req

    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
          .then(() => {
            req.flash('success_messages', '使用者資料編輯成功')
            res.redirect('/users/' + id)
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = userController
