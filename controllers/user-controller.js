const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordCheck) throw new Error('All field is required.')
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match.')

    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists.')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Registered successfully')
        return res.redirect('/signin')
      })
      .catch(error => next(error))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully')
    return res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully')
    req.logout()
    return res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAll({
        where: { userId: req.params.id },
        include: Restaurant,
        attributes: ['restaurant_id'],
        group: 'restaurant_id',
        nest: true,
        raw: true
      })
    ])
      .then(([userProfile, comments]) => {
        if (!userProfile) throw new Error("User didn't exist.")

        return res.render('users/profile', {
          user: getUser(req),
          userProfile: userProfile.toJSON(),
          comments
        })
      })
      .catch(error => next(error))
  },
  editUser: (req, res, next) => {
    return User.findByPk(getUser(req).id)
      .then(user => {
        if (!user) throw new Error("User didn't exist.")

        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(getUser(req).id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")

        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${getUser(req).id}`)
      })
      .catch(error => next(error))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        if (favorite) throw new Error('You have favorite this restaurant')

        return Favorite.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeFavorite: (req, res, next) => {
    const userId = getUser(req).id
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: { userId, restaurantId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorite this restaurant.")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        if (like) throw new Error('You already liked this restaurant')

        return Like.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    return Like.findOne({
      where: { userId, restaurantId }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(following => following.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('top-users', { users: result })
      })
      .catch(error => next(error))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist.")
        if (followship) throw new Error('You are already following this user')

        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user.")

        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  }
}

module.exports = userController
