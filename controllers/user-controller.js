const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    const { file } = req
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exist')
        return Promise.all([
          bcrypt.hash(req.body.password, 10),
          imgurFileHandler(file)
        ])
      })
      .then(([hash, image]) =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          image
        })
      )
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
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        include: Restaurant,
        raw: true,
        nest: true
      })
    ])
      .then(([user, comment]) => {
        const restaurants = comment.rows.map(r => r.Restaurant)
        if (!user) throw new Error("User didn't exist")
        return res.render('users/profile', {
          user,
          count: comment.count,
          restaurants
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // const login = req.user
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        // if (user.id !== login.id) throw new Error('It is not your profile')

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (!req.body.name) throw new Error('Name is required')
    const login = req.user
    const { file } = req
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist")
        if (user.id !== login.id) throw new Error('It is not your profile')
        return user.update({
          name: req.body.name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId: req.user.id, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        if (favorite) throw new Error('You have favorited this restaurant')
        return Favorite.create({ userId: req.user.id, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: { userId: req.user.id, restaurantId: req.params.restaurantId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
