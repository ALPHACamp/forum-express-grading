const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like, Followship } = require('../models')
const { uploadImage } = require('../helpers/file-helpers')
const { EditUserProfileError } = require('../helpers/error-helpers')

const userController = {
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
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(next)
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
  getUser: (req, res, next) => {
    const { id } = req.params
    const userId = Number(id)
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: {
          ...userId ? { userId } : {}
        },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        const data = comments.rows
          .map(c => ({ ...c }))
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/profile', {
          user,
          comments,
          data
        })
      })
      .catch(next)
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(next)
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const userId = req.user.id
    const { name } = req.body
    if (!name) throw new Error('Username is required!')
    const { file } = req
    if (Number(userId) !== Number(id)) throw new EditUserProfileError('Edit not allowed!')
    return Promise.all([
      User.findByPk(id),
      uploadImage(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
      })
      .catch(err => {
        if (err.name === EditUserProfileError) {
          req.flash('error_messages', 'Edit not allowed!')
          return res.redirect('back')
        }
        next(err)
      })
  },
  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
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
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You already favorited this restaurant!')
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(favorite => res.redirect('back'))
      .catch(next)
  },
  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(favoriteDeleted => res.redirect('back'))
      .catch(next)
  },
  addLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
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
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You already liked this restaurant!')
        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(like => res.redirect('back'))
      .catch(next)
  },
  removeLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't yet liked the restaurant!")
        return like.destroy()
      })
      .then(likeDeleted => res.redirect('back'))
      .catch(next)
  },
  getTopUsers: (req, res, next) => {
    const followingsId = req.user && req.user.Followings
    return User.findAll({
      include: [{
        model: User, as: 'Followers'
      }]
    })
      .then(users => {
        const data = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: followingsId.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('top-users', { users: data })
      })
      .catch(next)
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    const followerId = req.user.id
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You already followed this user!')
        return Followship.create({
          followerId,
          followingId: userId
        })
      })
      .then(followship => res.redirect('back'))
      .catch(next)
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    const followerId = req.user.id
    return Followship.findOne({
      where: {
        followerId,
        followingId: userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You didn't followed this user!")
        return followship.destroy()
      })
      .then(followshipDeleted => res.redirect('back'))
      .catch(next)
  }
}

module.exports = userController
