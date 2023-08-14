const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
// const { localFileHandler } = require('../helpers/file-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { where } = require('sequelize')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.name === req.body.password) throw new Error('Name and Passwords can not be same!')
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    if (!req.body.email.includes('@')) throw new Error('email should have @')

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
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, {
        raw: true
      }),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        include: Restaurant
      })
    ])
      .then(([user, comment]) => {
        if (!user) throw new Error("Ussr doesn't exist")
        const restaurants = comment.rows.map(r => r.Restaurant.dataValues)
        const restaurantNum = comment.count
        res.render('users/profile', { user, restaurantNum, restaurants })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const id = req.params.id
    const { file } = req
    if (!name) throw new Error('Name is required!')
    return Promise.all([
      User.findByPk(id),
      // localFileHandler(file)
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist")
        return user.update({
          name,
          image: filePath || user.image
        })
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
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')

      return Favorite.create({
        userId: req.user.id,
        restaurantId
      })
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      if (!favorite) throw new Error("You haven't favorited this restaurant")

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
      if (like) throw new Error('You have liked this restaurant!')

      return Like.create({
        userId: req.user.id,
        restaurantId
      })
        .then(() => res.redirect('back'))
        .catch(err => next(err))
    })
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    }).then(like => {
      if (!like) throw new Error("You haven't liked this restaurant")
      return like.destroy()
    })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
