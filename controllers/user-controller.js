const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const helpers = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    const { file } = req
    if (password !== passwordCheck) throw new Error('密碼與驗證密碼不相同')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email已註冊過')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return imgurFileHandler(file).then(filePath => {
          User.create({
            name,
            email,
            password: hash,
            image: filePath || null
          })
        })
      })
      .then(() => {
        req.flash('success_messages', '帳號註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    /*
      logout現在是非同步，需要有一個callback func才能正確執行
      所以在這加入err來處理錯誤
    */
    req.logout(err => {
      if (err) return next(err)
      req.flash('success_messages', '登出成功')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { userId: req.params.id },
        include: [Restaurant]
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('查無使用者資料')

        const count = comments.count
        const set = new Set()
        const filterComments = comments.rows.filter(comment =>
          !set.has(comment.Restaurant.id)
            ? set.add(comment.Restaurant.id)
            : false
        )
        const restCount = filterComments.length
        const currentComments = filterComments.map(comment => ({
          ...Comment,
          restaurantId: comment.Restaurant.id,
          restaurantImage: comment.Restaurant.image
        }))
        res.render('users/profile', {
          user: user.toJSON(),
          restCount,
          count,
          comments: currentComments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('查無該使用者')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('名稱為必填欄位')
    const { file } = req
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error('查無該使用者資料')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: helpers.getUser(req).id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('查無此餐廳')
        if (favorite) throw new Error('此餐廳已在最愛清單')

        return Favorite.create({
          userId: helpers.getUser(req).id,
          restaurantId
        })
      })
      .then(restaurants => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: {
        userId: helpers.getUser(req).id,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('還未將此餐廳加入最愛清單')

        return favorite.destroy()
      })
      .then(restaurants => res.redirect('back'))
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
        if (!restaurant) throw new Error('查無此餐廳')
        if (like) throw new Error('此餐廳已在喜愛清單')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error('還未將此餐廳加入喜愛清單')

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
        users = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: { followerId: req.user.id, followingId: req.params.userId }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('查無該使用者')
        if (followship) throw new Error('你已追蹤該使用者')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('你還未追蹤該使用者')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
