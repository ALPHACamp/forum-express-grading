const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser, authUser } = require('../helpers/auth-helpers')

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
      const authenticatedUser = getUser(req)
      if (authenticatedUser.id !== Number(req.params.id)) {
        throw new Error('unable to access')
      }
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
      const authenticatedUser = getUser(req)
      if (authenticatedUser.id !== Number(req.params.id)) {
        throw new Error('unable to access')
      }
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
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      const result = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('top-users', { users: result })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: req.user.id, followingId: userId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')
      await Followship.create({ followerId: req.user.id, followingId: userId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      if (!followship) throw new Error("You haven't followed this user!")
      await followship.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
