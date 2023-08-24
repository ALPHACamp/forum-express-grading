const bcrypt = require('bcryptjs')
const { User } = require('../models')

const { localFileHandler } = require('../helpers/file-helper')

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
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return res.render('profile', { person: user }) // 注意這裡避免跟登入user搞混 改為person
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        return res.render('edit-profile', { person: user }) // 注意這裡避免跟登入user搞混 改為person
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name, email } = req.body
    if (!name || !email) throw new Error('名稱及信箱不可為空')
    const { file } = req
    console.log('file is :', file)
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在')
        console.log('filePath is :', filePath)
        return user.update({
          name,
          email,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '修改使用者成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }

}

module.exports = userController
