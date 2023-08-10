const bcrypt = require('bcryptjs')
const db = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => {
        next(err)
      })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const DEFAULT_AVATAR = 'https://i.imgur.com/FUerPDO.png'
    const id = req.params.id
    return User.findByPk(id, {
      include: [
        Comment, {
          model: Comment,
          raw: true,
          include: Restaurant
        }
      ]
    })
      .then(user => {
        if (!user) throw new Error("user doesn't exist")
        user = user.toJSON()
        user.image = user.image || DEFAULT_AVATAR
        res.render('users/profile', { user, comments: user.Comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User不存在')
        res.render('users/edit', { user })
      })
  },
  putUser: (req, res, next) => {
    const { file } = req
    const { name } = req.body
    const userId = req.params.id

    if (req.user.id !== Number(userId)) {
      req.flash('error_messages', '無權請求')
      res.redirect('/restaurants')
    }

    if (!name) throw new Error('姓名是必要欄位')

    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    console.log(restaurantId)
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { restaurantId, userId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        if (like) throw new Error('您已覺得這餐廳很讚')
        return Like.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error('您尚未覺得讚')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        res.render('top-users.hbs', { users: users })
      })
      .catch(err => next(err))
  }

}

module.exports = userController
