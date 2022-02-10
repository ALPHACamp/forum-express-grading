const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Account registered successfully!')
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
    return Promise.all([
      User.findByPk(req.params.id, {
        nest: true,
        raw: true
      }),
      Comment.findAll({
        include: Restaurant,
        where: {
          userId: req.params.id
        },
        nest: true,
        raw: true
      })
    ])
      .then(([profileUser, comments]) => {
        if (!profileUser) {
          throw new Error("User didn't exist!")
        }
        const restaurants = []
        const set = new Set()
        for (const comment of comments) {
          if (!set.has(comment.Restaurant.id)) {
            set.add(comment.Restaurant.id)
            restaurants.push(comment.Restaurant)
          }
        }
        const defaultProfileIcon = `/upload/${process.env.DEFAULT_PROFILE}`
        return res.render('users/profile', { user: req.user, profileUser, defaultProfileIcon, restaurants })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    if (req.user.id !== parseInt(req.params.id)) {
      req.flash('error_messages', "User cannot edit other user's profile!")
      console.log(req.user)
      console.log(req.user.id, req.params.id)
      return res.redirect(`/users/${req.user.id}`)
    }
    return User.findByPk(req.params.id, {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) {
      throw new Error('User name is required')
    }
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) {
          throw new Error("User didn't exist")
        }
        return user.update({
          name,
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
