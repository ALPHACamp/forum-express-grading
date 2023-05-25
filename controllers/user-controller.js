const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // return 給下面的.then用
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出')
    req.logout(err => {
      if (err) console.error(err)
    })
    return res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('沒這人')
        const accountId = req.user.id
        const profileId = Number(req.params.id)
        console.log(accountId, profileId)
        res.render('user', { user, accountId, profileId })
      })
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('沒這人')
        res.render('user-edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) throw new Error('不要改別人的')
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('name要填')
    return Promise.all([
      imgurFileHandler(file),
      User.findByPk(req.user.id)
    ])
      .then(([filePath, user]) => {
        if (!user) throw new Error('見鬼了')
        user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => res.redirect(`/users/${req.user.id}`))
      .catch(err => next(err))
  }
}

module.exports = userController
