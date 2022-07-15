const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼 或 email 不正確！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('密碼 或 email 不正確！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '帳號註冊成功！')
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
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAll({
        include: Restaurant,
        where: { userId },
        attributes: ['restaurant_id'],
        group: 'restaurant_id',
        raw: true,
        nest: true
      })
    ])
      .then(([user, restComments]) => {
        if (!user) throw new Error('使用者不存在！')
        return res.render('users/profile', { user, restComments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('使用者名稱為必填欄位！')

    const authUser = getUser(req)
    const { file } = req

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在！')
        if (Number(user.id) === Number(authUser.id)) {
          return user.update({
            name,
            image: filePath || user.image
          })
        } else {
          req.flash('error_messages', '無法修改其它使用者資料！')
          return res.redirect(`/users/${authUser.id}`)
        }
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
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('餐廳不存在！')
        if (favorite) throw new Error('餐廳已經在最愛！')

        req.flash('success_messages', '餐廳加到最愛成功！')
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('餐廳不在最愛！')
        req.flash('success_messages', '餐廳移除最愛成功！')
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
