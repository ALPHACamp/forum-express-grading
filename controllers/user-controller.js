// - 處理屬於user路由的相關請求
const bcrypt = require('bcryptjs')
const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship
} = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // - 驗證表單
    try {
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match')
      }
      const foundUser = await User.findOne({ where: { email } })
      if (foundUser) throw new Error('User already exists!')
      const hash = bcrypt.hashSync(password, 10)
      await User.create({ name, email, password: hash })
      req.flash('success_messages', '註冊成功! 可進行登入了!')
      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '已成功登入!')
    return res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.logout(error => {
      if (error) return next(error)
    })
    req.flash('success_messages', '已成功登出!')
    return res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    const { id } = req.params
    try {
      if (getUser(req).id !== Number(id)) {
        throw new Error('無法存取非本人帳戶!')
      }
      let user = await User.findByPk(id, {
        nest: true,
        include: [{ model: Comment, include: [Restaurant] }],
        order: [[Comment, 'created_at', 'DESC']]
      })
      if (!user) throw new Error('使用者不存在!')
      user = user.toJSON()
      return res.render('users/profile', { user })
    } catch (error) {
      return next(error)
    }
  },
  editUser: async (req, res, next) => {
    const { id } = req.params
    try {
      if (getUser(req).id !== Number(id)) {
        throw new Error('無法存取非本人帳戶!')
      }
      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error('使用者不存在!')
      return res.render('users/edit', { user })
    } catch (error) {
      return next(error)
    }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req
    try {
      if (getUser(req).id !== Number(id)) {
        throw new Error('無法存取非本人帳戶!')
      }
      if (!name) throw new Error('名稱為必填!')
      const [user, filePath] = await Promise.all([
        User.findByPk(id),
        imgurFileHandler(file)
      ])
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${user.id}`)
    } catch (error) {
      return next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    try {
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error('餐廳不存在!')
      if (favorite) throw new Error('你已收藏過此餐廳!')

      await Favorite.create({
        userId,
        restaurantId
      })
      req.flash('success_messages', '收藏餐廳成功!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })

      if (!favorite) throw new Error('你尚未收藏過此餐廳!')

      await favorite.destroy()
      req.flash('success_messages', '已取消收藏!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  addLike: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    try {
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            restaurantId,
            userId
          }
        })
      ])
      if (!restaurant) throw new Error('餐廳不存在!')
      if (like) throw new Error('您已 Like 過此餐廳!')

      await Like.create({
        restaurantId,
        userId
      })
      req.flash('success_messages', '添加為喜愛餐廳成功!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  removeLike: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = getUser(req).id
    try {
      const like = await Like.findOne({
        where: {
          restaurantId,
          userId
        }
      })
      if (!like) throw new Error('您已 Unlike 過此餐廳!!')

      await like.destroy()
      req.flash('success_messages', '從喜愛餐廳中移除成功!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })

      const result = users
        .map(user => ({
          ...user.toJSON(), // -整理格式
          followerCount: user.Followers.length,
          // - 判斷目前登入者的是否有追蹤 user 物件
          isFollowed: getUser(req).Followings.some(f => f.id === user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount) // -按照追蹤者人數作排序

      return res.render('top-users', { users: result })
    } catch (error) {
      return next(error)
    }
  },
  addFollowing: async (req, res, next) => {
    const { userId } = req.params // -取得欲追蹤者 id
    try {
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: getUser(req).id,
            followingId: userId
          }
        })
      ])

      if (!user) throw new Error('此使用者不存在!')
      if (followship) throw new Error('您已追蹤此使用者!')

      await Followship.create({
        followerId: getUser(req).id,
        followingId: userId
      })
      req.flash('success_messages', '追蹤成功!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  },
  removeFollowing: async (req, res, next) => {
    const { userId } = req.params
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: getUser(req).id,
          followingId: userId
        }
      })

      if (!followship) throw new Error('您尚未追蹤過此使用者!')

      await followship.destroy()
      req.flash('success_messages', '取消追蹤成功!')
      return res.redirect('back')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = userController
