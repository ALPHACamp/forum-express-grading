const bcrypt = require('bcryptjs')
// const db = require('../models')
// const User = db.User
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      const user = await User.findOne({ where: { email } })
      if (user) { throw new Error('Email already exists!') }
      if (password !== passwordCheck) throw new Error('passwords do not match')
      const { file } = req
      const [filePath, passwordSalt] = await Promise.all([
        imgurFileHandler(file),
        bcrypt.hash(password, 10)
      ])
      await User.create({
        name,
        email,
        password: passwordSalt,
        image: filePath || null
      })
      req.flash('success_messages', '成功註冊帳號')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
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
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Comment, include: Restaurant }]
      })
      if (!user) { throw new Error("User didn't exist!") }
      res.render('users/profile', { user: user.toJSON()/*, myUser: req.user.id */ })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) { throw new Error("User didn't exist!") }
      // if (req.user.id !== Number(req.params.id)) throw new Error('User can only edit him or her own profile!')
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      if (req.user.id !== Number(req.params.id)) throw new Error('User can only edit him or her own profile!')
      const { file } = req
      const [user, filePath] = await Promise.all([
        User.findByPk(req.user.id),
        imgurFileHandler(file)
      ])
      if (!user) throw new Error("User didn't exist!")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.user.id}`)
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
          where: {
            userId: req.user.id,
            restaurantId
          }
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
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
