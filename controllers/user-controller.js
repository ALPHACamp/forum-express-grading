const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite } = db

const { imgurFileHelper } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_messages', '成功登出!')
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error("User dosen't exist!")

        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = req.params.id

    return User.findByPk(id, {
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    const { file } = req

    if (!name) throw new Error('User name is required!')
    if (Number(id) !== req.user.id) throw new Error('不能編輯其他人的資料')

    return Promise.all([
      User.findByPk(id),
      imgurFileHelper(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")

        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        if (favorite) throw new Error('You have already added this restaurant to your favorite!')

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
        if (!favorite) throw new Error("You haven't added this restaurant to your favorite!")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
