const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like } = db

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
  getUser: async (req, res, next) => {
    const id = Number(req.params.id)
    const loginUserId = Number(getUser(req).id)
    try {
      if (id !== loginUserId) {
        req.flash('error_messages', '無此權限')
        return res.redirect('back')
      }
      const user = await User.findByPk(loginUserId, {
        include: Comment
      })
      const comments = await Comment.findAll({
        where: { userId: loginUserId },
        include: Restaurant,
        raw: true,
        nest: true
      })
      if (!user) throw new Error('user do not exist !')
      res.render('users/profile', { user: user.toJSON(), comments })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    const id = Number(req.params.id)
    const loginUserId = Number(getUser(req).id)
    try {
      if (id !== loginUserId) throw new Error('無此權限')
      const user = await User.findByPk(loginUserId)
      if (!user) throw new Error('user do not exist !')
      res.render('users/edit', { user: user.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    const id = Number(req.params.id)
    const loginUserId = Number(getUser(req).id)
    const { name } = req.body
    const { file } = req
    try {
      if (id !== loginUserId) throw new Error('無此權限')
      const user = await User.findByPk(loginUserId)
      if (!user) throw new Error('user do not exist !')
      if (!name) throw new Error('name is required !')
      const filePath = await imgurFileHandler(file)
      await user.update({
        name,
        image: filePath || null
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${loginUserId}`)
    } catch (err) {
      next(err)
    }
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
      .catch(err => next(err))
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
      .catch(err => next(err))
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const restaurant = await Restaurant.findByPk(restaurantId)
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')
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
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        users = users.map(user => ({
          // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        res.render('top-users', { users: users })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
