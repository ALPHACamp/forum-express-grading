const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite } = require('../models/')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')

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
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: req.params.id },
        raw: true,
        nest: true,
        include: Restaurant
      })
    ])
      .then(([user, comments]) => {
        return res.render('users/profile', { user, count: comments.count, comments: comments.rows })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // if (req.user.id !== Number(req.params.id)) {
    //   req.flash('error_messages', '只能編輯自己的使用者資料！')
    //   return res.redirect(`/users/${req.user.id}`)
    // }
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '只能編輯自己的使用者資料！')
      res.redirect(`/users/${req.params.id}`)
    }
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name: name || user.name,
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
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        if (favorite) throw new Error('You have already favorited the restaurant!')
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', 'You are successfully added this restaurant to favorite!')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Favorite.findOne({ where: { restaurantId, userId } })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't added this restaurant to favorite!")
        return favorite.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'You have successfully remove this restaurant from favorite!')
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
