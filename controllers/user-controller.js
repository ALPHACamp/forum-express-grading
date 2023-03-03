const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const { removesWhitespace } = require('../helpers/object-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup', { name: req.flash('name'), email: req.flash('email') })
  },
  signUp: (req, res, next) => {
    const { name, email, password, confirmPassword } = removesWhitespace(req.body)
    if (!email || !password || !confirmPassword) throw new Error('必填欄位尚未填寫')
    if (password !== confirmPassword) throw new Error('確認密碼輸入的密碼與不一致')
    return User.findOrCreate({
      where: { email },
      defaults: { id: uuidv4(), name, email, password: bcrypt.hashSync(password, 10) }
    })
      .then(([user, created]) => {
        if (!created) return console.log('Email is already existed!')
        req.flash('success_messages', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err, req))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: passport.authenticate('local', {
    failureRedirect: '/signin',
    successRedirect: '/restaurants'
  }),
  logOut: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, {
        include: { model: Comment, include: Restaurant }
      })
      if (!user) throw new Error('使用者不存在')
      res.render('users/profile', { user: user.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error('使用者不存在')
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) throw new Error('使用者不存在，更新失敗')

      const { name } = req.body
      const image = await imgurFileHandler(req.file) || user.image
      await user.update({ name, image })
    } catch (err) {
      next(err)
    }
    req.flash('success_messages', '使用者資料編輯成功')
    res.redirect(`/users/${id}`)
  },
  addFavorite: async (req, res, next) => {
    const restaurantId = req.params.id
    const userId = req.user.id
    try {
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error('此餐廳不存在')
      if (favorite) throw new Error('已經收藏過此餐廳了')
      const created = await Favorite.create({ restaurantId, userId })
      if (created) res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    const restaurantId = req.params.id
    const userId = req.user.id
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error('此餐廳不存在')
      const isRemoved = await Favorite.destroy({ where: { restaurantId, userId } }) // 回傳0 or 1
      if (!isRemoved) throw new Error('尚未收藏此餐廳了')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { restaurantId, userId } })
      ])
      if (!restaurant) throw new Error('此餐廳不存在')
      if (like) throw new Error('已經讚過此餐廳了')
      const created = await Like.create({ restaurantId, userId })
      if (created) res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error('此餐廳不存在')
      const removed = await Like.destroy({ where: { restaurantId, userId } })
      if (!removed) throw new Error('已經取消過讚了')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
