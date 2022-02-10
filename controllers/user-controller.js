// load bcrypt.js
const bcrypt = require('bcryptjs')

const fileHelpers = require('../helpers/file-helpers')
const authHelpers = require('../helpers/auth-helpers')

// load db
const {
  User, Restaurant, Comment,
  Favorite, Like, Followship
} = require('../models')

// build controller
const userController = {
  // build signupPage and signup
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(password =>
        User.create({
          name,
          email,
          password
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(error => {
        next(error)
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // Get a user profile with id
  getUser: (req, res, next) => {
    const targetUserId = req.params.id
    // Get a user with all comment records of restaurant for himself or herself
    return User.findByPk(targetUserId, {
      include: [
        {
          model: Comment,
          include: Restaurant
        }
      ]
    })
      .then(targetUser => {
        // targetUser is the user record with all comment records
        // Remove repeated comment for same restaurant
        const simpleHashTable = {}
        const comments = targetUser.Comments || []
        for (let index = 0; index < comments.length; index++) {
          const key = comments[index].restaurantId.toString()
          if (simpleHashTable === {} || !simpleHashTable[key]) {
            simpleHashTable[key] = true
          } else {
            comments.splice(index, 1)
            index--
          }
        }
        targetUser = targetUser.toJSON()
        // Get number of commentd restaurant for the user
        const commentedRestaurantsCounts = Object.keys(simpleHashTable).length || 0

        return res.render('users/profile', {
          user: targetUser,
          commentedRestaurantsCounts
        })
      })
      .catch(error => next(error))
  },
  // Get a user edit page for profile
  editUser: (req, res, next) => {
    // prevent a user from getting edit page to another user with /users/:id in URI
    const userId = authHelpers.getUserId(req) || req.params.id
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        return res.render('users/edit', { user })
      })
      .catch(error => next(error))
  },
  // Update profile data for a user with id
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req

    const currentUserId = Number(authHelpers.getUserId(req))
    const userId = Number(req.params.id)
    // prevent a user from getting edit page to another user with /users/:id in URI
    if (currentUserId !== userId) return res.redirect('/')
    // upload image file and update profile data
    return Promise.all([
      User.findByPk(userId),
      fileHelpers.imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User did\'nt exist')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(error => next(error))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = authHelpers.getUserId(req)

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = authHelpers.getUserId(req)

    return Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('You haven\'t favorited this restaurant')

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  // Handling like/unlink
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = authHelpers.getUserId(req)
    // check whether the restaurant exists
    // check whether the restaurant exists in like table
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        if (like) throw new Error('You have clicked like button')
        // add it to like table
        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = authHelpers.getUserId(req)

    // check whether the restaurant is in like Table
    return Like.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(likedRestaurant => {
        if (!likedRestaurant) throw new Error('You haven\'t liked this restaurant')
        // remove it from like Table
        return likedRestaurant.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: { model: User, as: 'Followers' }
    })
      .then(users => {
        const currentUser = authHelpers.getUser(req)
        const results = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: currentUser.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('top-users', { users: results })
      })
      .catch(error => next(error))
  },
  // Handling following/unfollowing
  addFollowing: (req, res, next) => {
    // The target user who current user wants to follow
    const followingId = req.params.userId
    // The current User
    const followerId = authHelpers.getUserId(req)

    // Check whether the target user exists
    // Check whether the target user exists in following list of current user
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })
    ])
      .then(([user, following]) => {
        if (!user) throw new Error('User didn\'t exist')
        if (following) throw new Error('You are already following this user!')
        // add the user to the list
        return Followship.create({
          followerId,
          followingId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeFollowing: (req, res, next) => {
    // The target user who current user wants to follow
    const followingId = req.params.userId
    // The current User
    const followerId = authHelpers.getUserId(req)

    // Check whether the target user exists in the following list
    return Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then(following => {
        if (!following) throw new Error('You haven\'t followed this user!')
        // remove the user from the list
        return following.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  }
}

// exports controller
exports = module.exports = userController
