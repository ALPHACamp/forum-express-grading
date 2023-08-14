const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { include: { model: Comment, include: Restaurant } }).then(user => {
      if (!user) throw new Error('User didnt exist!')
      return res.render('users/profile', { user: user.toJSON() })
    })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true }).then(user => {
      if (!user) throw new Error('User didnt exist!')
      return res.render('users/edit', { user })
    })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User didnt exist!')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { restaurantId, userId: req.user.id } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('Restaurant didnt exist!')
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({ restaurantId, userId: req.user.id })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Favorite.findOne({ where: { restaurantId, userId: req.user.id } }).then(favorite => {
      if (!favorite) throw new Error('You havent favorited this restaurant!')
      return favorite.destroy()
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    console.log(restaurantId)
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { restaurantId, userId: req.user.id } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant didnt exist!')
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ restaurantId, userId: req.user.id })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Like.findOne({ where: { restaurantId, userId: req.user.id } }).then(like => {
      if (!like) throw new Error('You havent liked this restaurant!')
      return like.destroy()
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
