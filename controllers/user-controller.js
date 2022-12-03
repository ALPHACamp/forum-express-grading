const bcrypt = require('bcryptjs')
const { Restaurant, User, Favorite, Like } = require('../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Password do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10) // 可以少一層巢狀結構
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
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('Restaurant is already in your Favorite List!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back')) // 踢回上一頁
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('The Restaurant is not in your Favorite List!')

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, like]) => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You Liked this!')

      return Like.create({
        userId: req.user.id,
        restaurantId
      })
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    }).then(like => {
      if (!like) throw new Error("You didn't like this!")

      return like.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const reqUserId = req.params.id
    const userId = req.user.id
    User.findByPk(reqUserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users', { user: user.toJSON(), userId })
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const userId = req.user.id
    User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('edit-user', { user })
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const userId = req.user.id
    const { name } = req.body
    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (!name) throw new Error('Name is required!')
        return user.update({ name })
      })
      .then(() => res.redirect(`/users/${userId}`))
      .catch(err => next(err))
  }
}
module.exports = userController
