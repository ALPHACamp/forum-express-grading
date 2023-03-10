const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

const { imgurFileHander } = require('../helpers/file-helpers')

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
        req.flash('success_messages', 'Success fo SignUp!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  singInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'success for Sign In!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'success for Logout!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const { id } = req.params

    if (Number(getUser(req).id) !== Number(id)) throw new Error('只能編輯自己的頁面喔!')

    return Promise.all([
      User.findByPk(id),
      Comment.findAll({
        where: { userId: req.params.id },
        include: Restaurant,
        attributes: ['restaurant_id'],
        group: 'restaurant_id',
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('User did not exist!')

        res.render('users/profile', {
          user: user.toJSON(),
          comments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    if (getUser(req).id !== Number(id)) throw new Error('只能編輯自己的頁面喔!')

    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist!')

        res.render('users/edit', { user })
      })
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    if (!name) throw new Error('Name is required!')

    const { file } = req

    return Promise.all([
      User.findByPk(id),
      imgurFileHander(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User did not exist!')

        user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        if (favorite) throw new Error('You have not favorited this restaurant!')
        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
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
        if (!favorite) throw new Error('You have not favorited this restaurant!')

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        if (like) throw new Error('You have not like this restaurant')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
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
        if (!like) throw new Error('You have not like this restaurant.')

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
        res.render('top-users', { users })
      })
  }

}

module.exports = userController
