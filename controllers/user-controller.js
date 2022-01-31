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

  getUser: (req, res, next) => {
    const sessionUser = req.user
    const requestUserId = req.params.id
    const DEFAULT_COMMENT_COUNT = 0

    return User.findByPk(requestUserId, {
      include: { model: Comment, include: Restaurant },
      group: 'Comments.restaurant_id'
    })
      .then(user => {
        if (!user) throw new Error("User doesn't exist")
        user = user.toJSON()
        const count = user.Comments?.length || DEFAULT_COMMENT_COUNT

        return res.render('users/profile', {
          user, count, sessionUser
        })
      })
      .catch(err => next(err))
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

  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({ userId, restaurantId })
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have successfully added this restaurant to favorite'
        )
        return res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params

    return Favorite.findOne({
      where: { userId, restaurantId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => {
        req.flash(
          'success_messages',
          'You have successfully removed favorite from this restaurant'
        )
        return res.redirect('back')
      })
      .catch(err => next(err))
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
