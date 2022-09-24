const bcrypt = require('bcryptjs')

const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like } = db
const { localFileHelper } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('This email had already signed up!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', 'Signed up completed.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Sign in successfully')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'You\'ve logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { userId: id },
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('User does not exist!')
        if (!comments) { return res.render('users/profile', { user, commentsCounter: 0 }) }

        const singleComment = comments.rows.map(data => ({
          ...data.Restaurant
        }))
        return res.render('users/profile', { user, commentsCounter: comments.count, singleComment })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const currentUser = req.user.id
    const id = Number(req.params.id)
    const { name } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(id),
      localFileHelper(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User does not exist!')
        if (currentUser !== id) throw new Error('Can not edit other user\'s profile.')
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
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
        if (!restaurant) throw new Error('Restaurant does not exist!')
        if (favorite) throw new Error('You\'ve already added this restaurant before.')
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
        if (!favorite) throw new Error('The restaurant had not been added to your favorite before!')
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
          restaurantId,
          userId: req.user.id
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant does not exist!')
        if (like) throw new Error('Youv\'e already liked this restaurant before.')
        return Like.create({
          restaurantId,
          userId: req.user.id
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        restaurantId,
        userId: req.user.id
      }
    })
      .then(like => {
        if (!like) throw new Error('You had not liked this restaurant before.')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
