const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment, Favorite, Like } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const helper = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          throw new Error('Email already exists!')
        }
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
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    const userId = helper.getUser(req).id
    const userAuthed = (Number(id) === userId)
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { user_id: userId },
        nest: true,
        raw: true
      })
    ])
      .then(([user, commentResult]) => {
        const commentCount = commentResult.count
        const comments = commentResult.rows
        return res.render('users/profile', { user, userAuthed, commentCount, comments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    const userId = helper.getUser(req).id
    const userAuthed = (Number(id) === userId)
    if (!userAuthed) throw new Error('非使用者本人無法更改資料!')
    return User.findByPk(userId, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const userId = helper.getUser(req).id
    const userAuthed = (Number(id) === userId)
    if (!userAuthed) throw new Error('非使用者本人無法更改資料!')
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    return Promise.all([
      User.findByPk(userId),
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
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = helper.getUser(req).id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          restaurantId,
          userId
        }
      })
    ])
      .then(([restaurant, liked]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (liked) throw new Error('You have liked this restaurant!')
        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => {
        next(err)
      })
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(liked => {
        if (!liked) throw new Error("You haven't liked this restaurant!")
        return liked.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => {
        next(err)
      })
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length, // 計算追蹤者人數
          isFollowed: req.user.Followings.some(f => f.id === user.id) // 判斷目前登入使用者是否已追蹤該 user 物件
        }))
        res.render('top-users', { users: users })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
