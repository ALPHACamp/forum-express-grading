// load bcrypt.js
const bcrypt = require('bcryptjs')

const fileHelpers = require('../helpers/file-helpers')

// load db
const { User } = require('../models')

// build controller
const userController = {
  // build signupPage and signup
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(password =>
        User.create({
          name,
          email,
          password
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(error => {
        next(error)
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        return res.render('users/profile', { user })
      })
      .catch(error => next(error))
  },
  editUser: (req, res, next) => {
    const userId = req.params.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        return res.render('users/edit', { user })
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const userId = req.params.id

    Promise.all([
      User.findByPk(userId),
      fileHelpers.imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User did\'nt exist')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => res.redirect(`/users/${user.id}`))
      .catch(error => next(error))
  }

}

// exports controller
exports = module.exports = userController
