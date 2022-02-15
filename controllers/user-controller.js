const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      if (password !== passwordCheck) throw new Error('Password do not match!')
      const user = User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', 'Sign up success!')
      res.redirect('/signin')
    } catch (error) {
      next(error)
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
    req.logout()
    req.flash('success_messages', '成功登出！')
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const pageUser = await User.findByPk(id, { raw: true })
      const comments = await Comment.findAndCountAll({
        raw: true,
        nest: true,
        include: Restaurant,
        where: { userId: id }
      })
      const restaurants = comments.rows.map(item => {
        return item.Restaurant
      })
      if (!pageUser) throw new Error("User didn't exist!")
      res.render('users/profile', { pageUser, restaurants, commentCounts: comments.count })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    const id = Number(req.params.id)
    // if (id !== req.user.id) return res.redirect(`/users/${req.user.id}/edit`)
    try {
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    const id = Number(req.params.id)
    const { name } = req.body
    try {
      if (id !== req.user.id) throw new Error('僅可修改自己的資料！')
      if (!name) throw new Error('User name is required!')
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      const { file } = req
      const filePath = await imgurFileHandler(file)
      await user.update({ name, image: filePath || user.filePath })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')
      Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  addLike: async (req, res, next) => {
    const { restaurantId } = req.params
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
      Like.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}
module.exports = userController
