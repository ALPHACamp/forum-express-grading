const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exist!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '註冊成功!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin.hbs')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { include: { model: Comment, include: Restaurant }, nest: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // if (req.user.id !== Number(req.params.id)) throw new Error('User can only edit by himself !')
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (req.user.id !== Number(req.params.id)) throw new Error('User can only edit by himself !')
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist !")
        if (favorite) throw new Error('You have favorited this restaurant')
        return Favorite.create({ restaurantId, userId: req.user.id })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant is successfully favorited')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist !")
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant is successfully remove from favorite')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist !")
        if (like) throw new Error('You have liked this restaurant')
        return Like.create({ restaurantId, userId: req.user.id })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant is successfully liked')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist !")
        if (!like) throw new Error("You haven't liked this restaurant")
        return like.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant is successfully remove from like')
        res.redirect('back')
      })
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
    const { userId } = req.params
    return User.findByPk(userId, { include: [{ model: User, through: Followship, as: 'Followers' }] })
      .then(user => {
        const isFollowed = user.Followers.some(u => u.id === req.user.id)
        if (!user) throw new Error("User didn't exist !")
        if (isFollowed) throw new Error('You have followed this user')
        return Followship.create({ followingId: userId, followerId: req.user.id })
      })
      .then(() => {
        req.flash('success_messages', 'User is successfully followed')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    return Followship.findOne({ where: { followerId: req.user.id, followingId: userId } })
      .then(followship => {
        if (!followship) throw new Error('You have not followed this user')
        return followship.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'User is successfully remove from followed')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}
module.exports = userController
