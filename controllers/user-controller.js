const bcrypt = require('bcryptjs')
const db = require('../models')

const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match.')

    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) throw new Error('User exists.')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signed up successfully.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Logged in successfully.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        include: Restaurant
      })
    ]).then(([user, comments]) => {
      if (!user) throw new Error("User doesn't exist!")
      return res.render('users/profile', {
        user: user.toJSON(),
        commentCounts: comments.count,
        restaurants: comments.rows.map(r => r.Restaurant.toJSON())
      })
    })
    // return User.findByPk(req.params.id)
    //   .then(user => {
    //     if (!user) throw new Error("User doesn't exist!")
    //     return res.render('users/profile', { user: user.toJSON() })
    //   })
    //   .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // if (req.params.id.toString() !== req.user.id.toString()) throw new Error('User id error.')
    const { name } = req.body
    if (!name) throw new Error('Username is required.')
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("The restaurant doesn't exist!")
      if (favorite) throw new Error('This restaurant has already been favorited.')
      return Favorite.create({
        restaurantId,
        userId: req.user.id
      })
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("The restaurant doesn't exist!")
      if (!favorite) throw new Error("This restaurant hasn't been favorited.")
      return favorite.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ]).then(([restaurant, like]) => {
      if (!restaurant) throw new Error("The restaurant doesn't exist!")
      if (like) throw new Error('This restaurant has already been liked.')
      return Like.create({
        restaurantId,
        userId: req.user.id
      })
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ]).then(([restaurant, like]) => {
      if (!restaurant) throw new Error("The restaurant doesn't exist!")
      if (!like) throw new Error("This restaurant hasn't been liked.")
      return like.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        })).sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    console.log(req.params)
    console.log(req.user.id)
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ]).then(([user, followship]) => {
      if (!user) throw new Error("The user doesn't exist!")
      if (followship) throw new Error('You have been following the user already!')
      return Followship.create({
        followerId: req.user.id,
        followingId: userId
      })
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ]).then(([user, followship]) => {
      if (!user) throw new Error("The user doesn't exist!")
      if (!followship) throw new Error("You haven't followed the user!")
      return followship.destroy()
    }).then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
