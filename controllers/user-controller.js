const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Passwords do not match!')
    return User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  signinPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    req.flash('success_messages', '登入成功!')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    return res.redirect('/signin')
  },

  getUser: async (req, res, next) => {
    try {
      const sessionUser = req.user
      const requestUserId = req.params.id
      const DEFAULT_COUNT = 0

      const include = [
        { model: Comment, include: Restaurant }
      ]

      // usually, the following tables are included during user deserialization
      // but in case of request user ID does not match request parameter ID,
      // it's necessary to join these tables for later data processing.
      if (!sessionUser || sessionUser?.id !== requestUserId) {
        include.push(...[
          { model: Restaurant, as: 'FavoritedRestaurants' },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ])
      }

      let user = await User.findByPk(requestUserId, { include })
      if (!user) throw new Error("User doesn't exist")
      user = user.toJSON()

      // declare two arrays first, one for only ID array,
      // another one for actual object that will be used later.
      const commentIdArray = []
      const commentObjArray = []

      if (user.Comments?.length) {
        user.Comments.forEach(c => {
          if (!commentIdArray.includes(c.restaurantId)) {
            commentIdArray.push(c.restaurantId)
            commentObjArray.push(c)
          }
        })

        user.Comments = commentObjArray
      }

      // in case of request user ID does match request parameter ID,
      // we simply merge sessionUser data into user data
      if (sessionUser?.id === requestUserId) {
        user.FavoritedRestaurants = sessionUser.FavoritedRestaurants
        user.Followings = sessionUser.Followings
        user.Followers = sessionUser.Followers
      }

      // calculate total counts
      const commentCounts = user.Comments?.length || DEFAULT_COUNT
      const favoriteCounts = user.FavoritedRestaurants?.length || DEFAULT_COUNT
      const followingCounts = user.Followings?.length || DEFAULT_COUNT
      const followerCounts = user.Followers?.length || DEFAULT_COUNT

      return res.render('users/profile', {
        user,
        commentCounts,
        favoriteCounts,
        followingCounts,
        followerCounts,
        sessionUser
      })
    } catch (err) { next(err) }
  },

  editUser: (req, res, next) => {
    // since R03.test.js uses custom request,
    // so we have req.params as fallback
    const { id } = req.user || req.params

    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    // since R03.test.js uses custom request,
    // so we have req.params as fallback
    const { id } = req.user || req.params

    const { name } = req.body
    const { file } = req
    if (!name.trim()) throw new Error('Name field is required!')

    return Promise.all([
      User.findByPk(id), imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist")

        return user.update({
          name, image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },

  addFavorite: async (req, res, next) => {
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
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({ userId, restaurantId })

      req.flash(
        'success_messages',
        'You have successfully added this restaurant to favorite'
      )
      return res.redirect('back')
    } catch (err) { next(err) }
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
      if (!favorite) throw new Error("You haven't favorited this restaurant")

      await favorite.destroy()

      req.flash(
        'success_messages',
        'You have successfully removed favorite from this restaurant'
      )
      return res.redirect('back')
    } catch (err) { next(err) }
  },

  addLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist")
        if (like) throw new Error('You have liked this restaurant!')

        return Like.create({ userId, restaurantId })
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have liked this restaurant'
        )
        res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params

    return Like.findOne({
      where: { userId, restaurantId }
    })
      .then(like => {
        if (!like) throw new Error("You haven't Liked this restaurant")

        return like.destroy()
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have disliked this restaurant'
        )
        return res.redirect('back')
      })
      .catch(err => next(err))
  },

  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: { model: User, as: 'Followers' }
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)

        return res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },

  addFollowing: (req, res, next) => {
    const followerId = req.user.id
    const followingId = req.params.userId

    if (followerId === Number(followingId)) {
      throw new Error('You can not follow yourself!')
    }

    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: { followerId, followingId }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (followship) throw new Error('You have already followed this user!')

        return Followship.create({
          followerId, followingId
        })
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have successfully followed this user'
        )
        return res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeFollowing: (req, res, next) => {
    const followerId = req.user.id
    const followingId = req.params.userId

    return Followship.findOne({
      where: { followerId, followingId }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user")

        return followship.destroy()
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have successfully unfollowed this user'
        )
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
