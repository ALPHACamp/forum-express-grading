// FilePath: controllers/user-controllers.js
// Include modules
const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
// Options: localFileHandler, imgurFileHandler
const fileHandler = require('../helpers/file-helpers').imgurFileHandler

// User Controller
const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: async (req, res, next) => {
    try {
      let { name, email, password, passwordCheck } = req.body

      // Check form filling
      name = name.trim()
      email = email.trim()
      password = password.trim()
      passwordCheck = passwordCheck.trim()
      if (!name || !email || !password || !passwordCheck) {
        throw new Error('All block are required!')
      }

      // Check if password equals passwordCheck
      if (password !== passwordCheck) throw new Error('Passwords does not match Password Check!')

      // Check if email already signed up
      const userFound = await User.findOne({ where: { email } })
      if (userFound) throw new Error('Email already exists!')

      // Create new user
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      req.flash('success_messages', 'Sign up succeed!')
      return res.redirect('/signin')
    } catch (err) { next(err) }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in succeed!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Log out succeed!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const [targetUser, commentedRestaurants] = await Promise.all([
        User.findByPk(req.params.id, { raw: true }),
        Comment.findAll({
          attributes: ['restaurantId'],
          include: Restaurant,
          where: { userId: req.params.id },
          group: ['restaurantId'],
          nest: true,
          raw: true
        })
      ])

      if (!targetUser) throw new Error("User didn't exist!")
      res.render('users/profile', {
        user: getUser(req),
        targetUser,
        commentedRestaurants
      })
    } catch (err) { next(err) }
  },
  editUser: async (req, res, next) => {
    try {
      const loginUser = getUser(req)
      const targetUser = await User.findByPk(req.params.id, { raw: true })

      if (!targetUser) throw new Error("User didn't exist!")
      if (loginUser.id !== targetUser.id) {
        req.flash('error_messages', "No permission to edit other's profile")
        res.redirect(`/users/${targetUser.id}`)
      }

      res.render('users/edit', { user: targetUser })
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      // Check if required info got null
      let { name } = req.body
      name = name.trim()
      if (!name) throw new Error('User name is required!')

      // Update user info
      const loginUser = getUser(req)
      const { file } = req
      const [filePath, user] = await Promise.all([
        fileHandler(file),
        User.findByPk(req.params.id)
      ])

      if (!user) throw new Error('User did not exist!')
      if (loginUser.id !== user.id) throw new Error("No permission to edit other's profile!")

      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) { next(err) }
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

      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) { next(err) }
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
    } catch (err) { next(err) }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) { next(err) }
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
    } catch (err) { next(err) }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const userData = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      const topUsers = userData
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users: topUsers })
    } catch (err) { next(err) }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: userId
          }
        })
      ])

      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId: req.user.id,
        followingId: userId
      })

      res.redirect('back')
    } catch (err) { next(err) }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })

      if (!followship) throw new Error("You haven't followed this user!")

      await followship.destroy()
      res.redirect('back')
    } catch (err) { next(err) }
  }
}

module.exports = userController
