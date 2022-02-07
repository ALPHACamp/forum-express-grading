const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  getUser: (req, res, next) => {
    return User
      .findByPk(req.params.id, {
        include: {
          model: Comment,
          include: Restaurant
        }
      })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User
      .findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (Number(req.params.id) !== req.user.id) throw new Error("User didn't match!")
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User did'nt exit")
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User
      .findOne({ where: { email: req.body.email } })
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
        req.flash('success_messages', '成功註冊帳號！')
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
  addFavorite: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      Favorite.findOne({ where: { userId: req.user.id, restaurantId: req.params.id } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({ userId: req.user.id, restaurantId: req.params.id })
      })
      .then(() => res.redirect('/restaurants'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite
      .findOne({ where: { userId: req.user.id, restaurantId: req.params.id } })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = userController
