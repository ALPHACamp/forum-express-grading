const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { authUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('Passwords do not match!')
      }
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
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
  getUser: async (req, res, next) => {
    try {
      authUser(req)
      const [user, comments] = await Promise.all([
        User.findByPk(req.params.id),
        Comment.findAndCountAll({
          include: Restaurant,
          where: { userId: req.params.id },
          raw: true,
          nest: true
        })
      ])
      const storeRestaurantId = []
      const newComments = []
      comments.rows.forEach(c => {
        if (!storeRestaurantId.includes(c.restaurantId)) {
          newComments.push(c)
          storeRestaurantId.push(c.restaurantId)
        }
      })
      if (!user) throw new Error("User did't exist")
      res.render('users/profile', {
        user: user.toJSON(),
        comments: newComments,
        restaurantCount: comments.count
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      authUser(req)
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User did't exist")
      res.render('users/edit', { user: user.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      authUser(req)
      const { name } = req.body
      if (!name) throw new Error('User name is required')
      const { file } = req
      const [user, filePath] = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      if (!user) throw new Error("User did't exist")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: { userId: req.user.id, restaurantId }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const favorite = await Favorite.findOne({
        where: { userId: req.user.id, restaurantId }
      })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { userId: req.user.id, restaurantId } })
      ])
      if (!restaurant) throw new Error("Restaurant did't exist")
      if (like) throw new Error('You have liked this restaurant already')
      await Like.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const like = await Like.findOne({ where: { userId: req.user.id, restaurantId } })
      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
