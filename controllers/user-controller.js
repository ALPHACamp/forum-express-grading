
const bcrypt = require('bcryptjs')

const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like } = db

const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) return next(new Error('Passwords do not match!'))

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
  // (頁面)瀏覽profile
  getUser: (req, res, next) => {
    // 資料已在res.locals.user中，理論上不必再讀或傳
    // 但測試檔未經完整流程，res.locals中可能無資料
    return User.findByPk(req.params.id, {
      nest: true,
      include: [{ model: Comment, include: Restaurant }]
    })
      .then(user => {
        if (!user) throw new Error('user not exist!')
        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  // (頁面)編輯profile
  editUser: (req, res, next) => {
    // 資料已在res.locals.user中，理論上不必再讀或傳
    // 但測試檔未經完整流程，res.locals中可能無資料
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('user not exist!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // (功能)編輯profile
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')

    const { file } = req

    // return imgurFileHandler(file)
    //   .then(filePath => {
    //     return User.update({
    //       name,
    //       image: filePath
    //     }, { where: { id: req.params.id } })
    //   })

    return Promise.all([imgurFileHandler(file), User.findByPk(req.params.id)])
      .then(([filePath, user]) => {
        if (!user) throw new Error('user not exist!')

        return user.update({ name, image: filePath || user.toJSON().image }) // 如果未提供新圖，保留原圖
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  // (功能)新增最愛
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId: req.user.id, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        if (favorite) throw new Error('restaurant is ALREADY in your favorited list!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // (功能)移除最愛
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("restaurant ISN'T in your favorited list!")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // (功能)新增like
  addLike: (req, res, next) => {
    const restaurantId = req.params.restaurantId

    console.log(restaurantId)

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId: req.user.id, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        if (like) throw new Error('restaurant is ALREADY in your liked list!')

        return Like.create({ userId: req.user.id, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // (功能)移除like
  removeLike: (req, res, next) => {
    const restaurantId = req.params.restaurantId

    return Like.findOne({ where: { userId: req.user.id, restaurantId } })
      .then(like => {
        if (!like) throw new Error("restaurant ISN'T in your liked list!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
