const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // return 給下面的.then用
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_message', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出')
    req.logout(err => {
      if (err) console.error(err)
    })
    return res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { user_id: req.params.id },
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        res.render('users/profile', {
          user,
          comments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('沒這人')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) throw new Error('不要改別人的')
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('name要填')
    return Promise.all([
      imgurFileHandler(file),
      User.findByPk(req.user.id)
    ])
      .then(([filePath, user]) => {
        if (!user) throw new Error('見鬼了')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      // 要先反查是否已經加入了, 已經有就跳出
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('沒這間')
        if (favorite) throw new Error('是要加幾次?')
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
        if (!favorite) throw new Error('刪空氣?')
        return favorite.destroy()
      })
      .then(() => {
        req.flash('success_message', '已移除我的最愛')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const restaurantId = Number(req.params.restaurantId)
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('加空氣?')
        if (like) throw new Error('要like幾次?')
        return Like.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const restaurantId = Number(req.params.restaurantId)
    const userId = req.user.id
    return Like.findOne({
      where: {
        restaurantId,
        userId
      }
    })
      .then(like => {
        if (!like) throw new Error('刪空氣?')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => (err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
    // 使用const result = xxxx  而不直接拿回傳users做處理 可以保留原始的資料
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  // 追蹤功能
  addFollowing: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.userId),
      Followship.findOne({
        where: {
          followerId: req.user.id, // 自己就是A
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('沒這人')
        if (followship) throw new Error('跟蹤狂喔')
        return Followship.create({
          followerId: req.user.id,
          followingId: req.params.userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('刪空氣?')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
