const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helper')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => res.render('signup'),

  signUp: (req, res, next) => {
    const { name, email, password } = req.body

    if (password !== req.body.passwordCheck) { throw new Error('Passwords do not match!') }

    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => res.render('signin'),

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    return res.redirect('/signin')
  },

  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAll({
        where: { userId: req.params.id },
        include: Restaurant,
        attributes: ['restaurant_id'],
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error("User didn't exist!")

        return res.render('users/profile', { user: user.toJSON(), comments })
      })
      .catch(error => next(error))
  },

  editUser: (req, res, next) => {
    if (getUser(req).id !== req.params.id) throw new Error("You can't edit others profile!")

    return User.findByPk(getUser(req).id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(error => next(error))
  },

  putUser: (req, res, next) => {
    const { file } = req
    const { name } = req.body

    return Promise.all([
      User.findByPk(req.user.id),
      imgurFileHandler(file)
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
        return res.redirect(`/users/${req.user.id}`)
      })
      .catch(error => next(error))
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
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },

  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
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
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },

  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  }

}

module.exports = userController
