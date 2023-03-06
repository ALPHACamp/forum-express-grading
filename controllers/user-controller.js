const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordCheck) throw new Error('All field is required.')
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match.')

    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Registered successfully')
        return res.redirect('/signin')
      })
      .catch(error => next(error))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully')
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    return res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(userProfile => {
        if (!userProfile) throw new Error("User didn't exist.")

        return res.render('users/profile', {
          user: getUser(req),
          userProfile: userProfile.toJSON()
        })
      })
      .catch(error => next(error))
  },
  editUser: (req, res, next) => {
    if (getUser(req).id !== Number(req.params.id)) throw new Error('You do not have permission to access this page.')

    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist.")

        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (getUser(req).id !== Number(req.params.id)) throw new Error('You do not have permission to access this page.')

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")

        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(error => next(error))
  }
}

module.exports = userController
