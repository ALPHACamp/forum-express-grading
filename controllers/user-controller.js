const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  // sign up
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords does not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('User has already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Sign up successfully!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  // sign in
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully!')
    res.redirect('/restaurants')
  },
  // sign out
  logout: (req, res, next) => {
    req.flash('success_messages', 'Log out successfully!')
    req.logout(err => {
      if (err) return next(err)
    })
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        user = user.toJSON()
        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // 只有user本人可以更新資料
    if (Number(req.params.id) !== req.user.id) {
      return res.redirect(`/users/${req.params.id}`)
    }
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          name: req.body.name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
