const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      // if password not match passwordCheck
      if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
      // if email exist
      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) throw new Error('Email already exists!')
      // if everything is fine
      const hash = bcrypt.hashSync(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', 'Account register successfully!')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', 'Logout successfully!')
    req.logout(err => {
      if (err) return next(err)
    })
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      const comments = await Comment.findAndCountAll({
        raw: true,
        nest: true,
        include: Restaurant,
        where: { userId: req.params.id }
      })
      res.render('users/profile', { user, comments: comments.rows, count: comments.count })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      const { file } = req
      const filePath = await imgurFileHandler(file)
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
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
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            restaurantId,
            userId: req.user.id
          }
        })
      ])
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
      const { restaurantId } = req.params
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!like) throw new Error("You haven't liked this restaurant!")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      console.log(users)
      const datas = users
        .map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(fing => fing.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      res.render('top-users', { users: datas })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const [user, following] = await Promise.all([
        User.findByPk(req.params.userId),
        Followship.findOne({
          where: {
            followerId: req.user.id,
            followingId: req.params.userId
          }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (following) throw new Error('You have followed this User!')
      await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const following = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      if (!following) throw new Error("You haven't followed this User!")
      await following.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
