const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helpers')

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
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
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
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        user = user.toJSON()

        user.commentedRestaurants = user.Comments && user.Comments.reduce((acc, c) => {
          if (!acc.some(r => r.id === c.restaurantId)) {
            acc.push(c.Restaurant)
          }
          return acc
        }, [])

        res.render('users/profile', {
          user
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    if (Number(req.params.id) !== req.user.id) {
      req.flash('error_messages', '不能編輯他人的資料')
      return res.redirect(`/users/${req.params.id}`)
    }

    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')

    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")

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
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

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
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
