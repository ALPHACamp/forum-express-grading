const db = require('../models')
const bcrypt = require('bcryptjs')
const { User, Favorite, Restaurant } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exist!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
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
    req.flash('success_messages', '成功登出')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("This restaurant didn't exist.")
        if (favorite) throw new Error('This restaurant is already in your favorite list.')
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId
    return Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("This restaurant isn't in your favorite list.")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const userId = req.user.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("This user didn't exist.")
        return res.render('users/profile', { user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.user.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("This user didn't exist.")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.user.id
    // const {}
    // Promise.all([])
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("This user didn't exist.")
        req.flash('success_messages', '使用者資料編輯成功')
        return res.render('users/edit')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
