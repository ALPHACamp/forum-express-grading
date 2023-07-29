const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      return res.render('signup')
    } catch (error) {
      return next(error)
    }
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hashSync(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', 'register success!')
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },

  signInPage: async (req, res, next) => {
    try {
      return res.render('signin')
    } catch (error) {
      return next(error)
    }
  },

  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      return res.redirect('/restaurants')
    } catch (error) {
      return next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      req.flash('success_messages', '登出成功！')
      req.logout()
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const promiseData = await Promise.all([
        User.findByPk(req.params.id, { raw: true }),
        Comment.findAll({
          raw: true,
          nest: true,
          where: { userId: req.params.id },
          include: Restaurant
        })
      ])
      const user = promiseData[0]
      const comments = promiseData[1]

      if (!user) throw new Error("User doesn't exists!")

      return res.render('users/profile', { user, comments })
    } catch (error) {
      return next(error)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        raw: true
      })

      if (!user) throw new Error("User doesn't exists!")

      return res.render('users/edit', { user: user })
    } catch (error) {
      return next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { file } = req
      if (!name) throw new Error('User name is required!')

      const promiseData = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      const user = promiseData[0]
      const filePath = promiseData[1]

      if (!user) throw new Error("User doesn't exists!")

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${req.params.id}`)
    } catch (error) {
      return next(error)
    }
  },

  addFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { restaurantId } = req.params

      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist")
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({
        userId,
        restaurantId
      })
      req.flash('success_messages', 'You have successfully added this restaurant to favorite')

      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { restaurantId } = req.params

      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: { userId, restaurantId }
        })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist")
      if (!favorite) throw new Error("You have'n favorited this restaurant")

      await favorite.destroy()
      req.flash('success_messages', 'You have successfully removed favorite from this restaurant')

      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },

  addLike: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { restaurantId } = req.params

      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist")
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({
        userId,
        restaurantId
      })
      req.flash('success_messages', 'You have successfully added this restaurant to like')

      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const userId = req.user.id
      const { restaurantId } = req.params

      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: { userId, restaurantId }
        })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist")
      if (!like) throw new Error("You haven't liked this restaurant")

      await like.destroy()
      req.flash('success_messages', 'You have successfully removed like from this restaurant')

      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController
