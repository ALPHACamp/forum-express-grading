const bcrypt = require('bcryptjs')
const { Comment, User, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
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
    const id = req.params.id
    return User.findByPk(id, {
      nest: true,
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        const nonRepeatRestComments = user
          .toJSON()
          .Comments.filter(function (comment, index, array) {
            // 將每一個 comment 重新丟進原 array 確認 index , 若 index 非一次出現的值，則為重複的餐廳
            return array.findIndex(arr => arr.Restaurant.id === comment.Restaurant.id) === index
          })
        return res.render('users/profile', { user: user.toJSON(), comments: nonRepeatRestComments })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const id = req.params.id
    const canEdit = req.user.id === Number(id)
    if (!canEdit) {
      req.flash('error_messages', '禁止編輯他人資料')
      return res.redirect(`/users/${id}`)
    }
    const { name } = req.body
    const { file } = req
    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("user didn't exist!")
        return user.update({ name: name || user.name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${id}`)
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
