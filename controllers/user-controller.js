const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

const { localFileHandler, defaultAvatarPath } = require('../helpers/file-helper')
const favorite = require('../models/favorite')
const followship = require('../models/followship')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.passwordCheck !== req.body.password) throw new Error('Password do not match')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      )
      .then(() => {
        req.flash('success_messages', '註冊成功!')
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
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        if (!user.image) {
          user.image = defaultAvatarPath // 指定預設頭貼
        }
        return res.render('users/profile', { user: user.toJSON() })
      }).catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        // if (user.id !== req.user.id) throw new Error('請勿修改他人資料')
        return res.render('users/edit', { user })
      }).catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name, email } = req.body
    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在')
        // if (user.id !== req.user.id) throw new Error('請勿修改他人資料')
        return user.update({
          name,
          email,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([ // 先查找有無餐廳 以及是否收藏過
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        if (favorite) throw new Error('你已經收藏過了')
        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', '收藏成功')
        return res.redirect('back')
      })
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
        if (!favorite) throw new Error('尚未收藏此餐廳')
        return favorite.destroy()
      })
      .then(() => {
        req.flash('success_messages', '移除收藏成功')
        return res.redirect('back')
      })
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
        if (!restaurant) throw new Error('此餐廳不存在')
        if (like) throw new Error('已經按過讚')
        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', '點贊成功')
        return res.redirect('back')
      })
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
        if (!like) throw new Error('尚未點讚')
        return like.destroy()
      })
      .then(() => {
        req.flash('success_messages', '收回讚')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll(
      {
        include: { model: User, as: 'Followers' }
      })
      .then(users => {
        users = users.map(
          user => ({ // 教案另外使用data存取陣列
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          })
        ).sort((user1, user2) => user2.followerCount - user1.followerCount)
        return res.render('top-users', { users })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: { // 記得還是要where 才能同時滿足二條件
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        console.log('這個追蹤: ', followship)
        if (!user) throw new Error('用戶不存在')
        if (followship) throw new Error('已經追蹤過')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      }).then(() => {
        req.flash('success_messages', '追蹤成功')
        return res.redirect('back')
      }).catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: { // 記得where
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('尚未追蹤此用戶')
        return followship.destroy()
      })
      .then(() => {
        req.flash('success_messages', '已取消追蹤')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }

}
module.exports = userController
