const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const assert = require('assert')

const uerController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      // password 與 passwordCheck有無一致
      if (password !== passwordCheck) throw new Error('Passwrod do not match !')
      // email 有無重複
      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      User.create({ name, email, password: hash })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  signInPage: (req, res) => {
    res.render('signIn')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, { raw: true })
      const comments = await Comment.findAndCountAll({
        where: { userId: id },
        include: Restaurant,
        // group: 'Restaurant.id', // 線上測試環境不支援，改用JavaSript在本地處理
        nest: true,
        raw: true
      })
      assert(user, "User didn't exist!")
      const commentedRestaurants = [...new Set(comments.rows.map(item => JSON.stringify(item.Restaurant)))].map(item => JSON.parse(item))
      res.render('users/profile', { user, commentedRestaurants, commentedRestaurantsAmount: commentedRestaurants.length })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, { raw: true })
      assert(user, "User didn't exist!")
      res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { id } = req.params
      const filePath = await imgurFileHandler(req.file)
      const user = await User.findByPk(id)
      assert(user, "User didn't exist!")
      await user.update({ name, image: filePath || null })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${id}`)
    } catch (error) {
      next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    const restaurantId = Number(req.params.id)
    const userId = Number(getUser(req).id)
    try {
      const [restaurant, user, favorite] = await Promise.all(
        [User.findByPk(userId),
          Restaurant.findByPk(restaurantId),
          Favorite.findOne({ where: { userId, restaurantId } })
        ])
      assert(restaurant, "Restaurant didn't exist!")
      assert(user, "User didn't exist!")
      assert(!favorite, '這間餐廳已在清單中')
      await Favorite.create({ userId, restaurantId })
      req.flash('success_messages', '成功加入清單')
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  deleteFavorite: async (req, res, next) => {
    const restaurantId = Number(req.params.id)
    const userId = Number(getUser(req).id)
    try {
      const favorite = await Favorite.findOne({ where: { userId, restaurantId } })
      assert(favorite, '這間餐廳已不在清單中')
      favorite.destroy()
      req.flash('success_messages', '成功移出清單')
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  addLike: async (req, res, next) => {
    const restaurantId = req.params.restaurantId
    const userId = req.user.id
    try {
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { userId, restaurantId } })
      ])
      assert(restaurant, "Restaurant didn't exist")
      assert(!like, '已被評論')

      await Like.create({ userId, restaurantId })
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const restaurantId = req.params.restaurantId
      const userId = getUser(req).id
      const like = await Like.findOne({ where: { userId, restaurantId } })
      assert(like, '你不能點兩次UnLike')
      await like.destroy()
      res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        raw: true,
        nest: true,
        include: [{ model: User, as: 'Followers' }]
      })
      users = users.map(user => ({
        ...user,
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      }))
      res.render('user-top', { users })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = uerController
