const bcrypt = require('bcryptjs')
const { Restaurant, User, Comment, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('兩次密碼輸入不同！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('信箱重複！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({ name: req.body.name, email: req.body.email, password: hash }))
      .then(() => {
        req.flash('success_msg', '成功註冊帳號！')
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
      nest: true,
      include: [{
        model: Comment,
        include: Restaurant
      }]
    })
      .then(user => {
        if (!user) throw new Error('找不到使用者！')
        return res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('找不到使用者！')

        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: async (req, res, next) => {
    // 驗證使用者身份與資料
    const userId = req.user.id
    if (Number(req.params.id) !== userId) {
      req.flash('error_messages', '無法編輯其他使用者的資料！')
      return res.redirect(`/users/${userId}`)
    }

    try {
      const { name } = req.body
      if (!name) throw new Error('名稱為必填！')
      const { file } = req
      const [user, filePath] = await Promise.all([
        User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])
      if (!user) throw new Error('找不到使用者！')

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${req.params.id}`)
    } catch (err) {
      next(err)
    }
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
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')

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
        if (!like) throw new Error("You haven't liked this restaurant")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
