const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite } = require('../models')
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
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  }
}

module.exports = userController
