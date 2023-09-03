const bcrypt = require('bcryptjs') // 載入 bcrypt
const { Comment, User, Restaurant, Favorite, Like } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
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
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAll({
        where: { userId: req.params.id },
        raw: true
      })
    ])
      .then(async ([user, comment]) => {
        if (!user) throw new Error("User didn't exist!")
        const commentResID = comment.map(obj => obj.restaurantId)
        const restaurant = await Restaurant.findAll({
          where: {
            id: commentResID
          },
          raw: true
        })
        const numRestaurant = restaurant.length
        res.render('users/profile', { user: user.toJSON(), num_restaurant: numRestaurant, restaurant: restaurant })
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id).then(user => {
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user: user.toJSON() })
    }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (req.user.id !== Number(req.params.id)) throw new Error('只能更改自己的資料！')
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("Restauarant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      return Promise.all([
        Favorite.create({
          userId: req.user.id,
          restaurantId
        }),
        restaurant.increment({
          numFavorite: 1
        })
      ]).then(() => res.redirect('back'))
    })
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Promise.all([
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      }),
      Restaurant.findByPk(req.params.restaurantId)
    ]).then(([favorite, restaurant]) => {
      if (!favorite) throw new Error("You haven't favorited this restaurant")

      return Promise.all([
        favorite.destroy(),
        restaurant.decrement({
          numFavorite: 1
        })]).then(() => res.redirect('back'))
    }).catch(err => next(err))
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
      if (!restaurant) throw new Error("Restauarant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
      return Promise.all([
        Like.create({
          userId: req.user.id,
          restaurantId
        }),
        restaurant.increment({
          numLike: 1
        })
      ]).then(() => res.redirect('back'))
    })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Promise.all([
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      }),
      Restaurant.findByPk(req.params.restaurantId)
    ]).then(([like, restaurant]) => {
      if (!like) throw new Error("You haven't liked this restaurant")

      return Promise.all([
        like.destroy(),
        restaurant.decrement({
          numLike: 1
        })]).then(() => res.redirect('back'))
    }).catch(err => next(err))
  }

}

module.exports = userController
