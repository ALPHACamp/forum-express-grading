const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship, sequelize } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  getSignUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    // check if the password confirmation does match
    if (req.body.password !== req.body.passwordCheck) throw new Error('The password confirmation does not match.')
    // check if the email already exists
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        // else store the user register information
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Register successfully! Please login to your account.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  getSignInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', 'Login successfully!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', 'You have successfully logged out.')
    req.logout()
    res.redirect('/signin')
  },
  // get user's profile page
  getUser: (req, res, next) => {
    return Promise
      .all([
        Comment.findAll({
          where: { userId: req.params.id },
          attributes: ['restaurantId'],
          group: 'restaurantId',
          include: Restaurant,
          nest: true,
          raw: true
        }),
        User.findByPk(req.params.id, { raw: true })
      ])
      .then(([comments, userProfile]) => {
        if (!userProfile) throw new Error("User doesn't exist.")
        res.render('users/profile', {
          user: getUser(req),
          userProfile,
          comments
        })
      })
      .catch(e => next(e))
  },
  // get edit user's profile page
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(userProfile => {
        if (!userProfile) throw new Error("User doesn't exist.")
        res.render('users/edit', { user: userProfile })
      })
      .catch(e => next(e))
  },

  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name.trim()) throw new Error('User name is required!')
    return Promise
      .all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist.")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(e => next(e))
  },

  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },

  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant!")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },

  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },

  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },

  getTopUsers: (req, res, next) => {
    User.findAll({
      attributes: {
        include: [[sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']]
      },
      order: [[sequelize.literal('followerCount'), 'DESC']]
    })
      .then(users => {
        const followingsId = new Set()
        req.user.Followings.forEach(f => followingsId.add(f.id))
        const result = users.map(user => ({
          ...user.toJSON(),
          isFollowed: followingsId.has(user.id)
        }))
        res.render('top-users', { users: result })
      })
      .catch(e => next(e))
  },

  addFollowing: (req, res, next) => {
    // current user is a follower
    const followerId = req.user.id
    const followingId = req.params.userId
    if (followerId === Number(followingId)) throw new Error("User can't follow themself")

    Promise.all([
      User.findByPk(followingId),
      Followship.findOne({ where: { followerId, followingId } })
    ])
      .then(([followingUser, followship]) => {
        if (!followingUser) throw new Error("The user you want to follow doesn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({ followerId, followingId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },

  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  }
}

module.exports = userController
