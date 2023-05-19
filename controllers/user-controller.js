const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) throw new Error('Password dot not match!')

      const user = await User.findOne({ where: { email: req.body.email } })

      if (user) throw new Error('Email already exists!')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      next(err)
    }
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
  getUser: async (req, res, next) => {
    try {
      // 反查user 確認user是否存在
      const user = await User.findByPk(
        req.params.id,
        {
          include: [
            {
              model: Comment,
              include: Restaurant
            }
          ]
        }
      )
      if (!user) throw new Error("User didn't exist!")

      res.render('users/profile', { user: user.toJSON() })
    } catch (err) { next(err) }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      // 檢查user.id / req.user.id
      if (req.user) {
        if (user.id !== req.user.id) {
          return res.redirect(`/users/${req.user.id}/edit`)
        }
      }
      res.render('users/edit', { user: user.toJSON() })
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('User name is required!')
      const { file } = req

      const [user, filePath] = await Promise.all([User.findByPk(req.params.id),
        imgurFileHandler(file)
      ])

      if (!user) throw new Error("User didn't exist!")
      if (user.id !== req.user.id) throw new Error("User can't modify others profile")
      await user.update({
        name,
        image: filePath || user.image
      })
      req.flash('success_messages', '使用者資料編輯成功')

      res.redirect(`/users/${user.id}`)
    } catch (err) { next(err) }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      // 如果已經在favorite
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })

      res.redirect('back')
    } catch (err) { next(err) }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params

      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })

      // 如果favorite不存在
      if (!favorite) throw new Error("You haven't favorited this restaurant")

      await favorite.destroy()

      res.redirect('back')
    } catch (err) { next(err) }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      // 如果已經like
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({
        userId: req.user.id,
        restaurantId
      })

      res.redirect('back')
    } catch (err) { next(err) }
  },
  removeLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params

      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })

      // 如果like不存在
      if (!like) throw new Error("You haven't liked this restaurant")

      await like.destroy()

      res.redirect('back')
    } catch (err) { next(err) }
  },
  getTopUsers: async (req, res, next) => {
    try {
      // 撈出所有 User 與 followers 追蹤者的資料
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })

      const result = users.map(user => ({
        // 整理格式
        ...user.toJSON(),
        // 計算追蹤者人數
        followerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 user 物件
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      })).sort((a, b) => b.followerCount - a.followerCount)

      res.render('top-users', { users: result })
    } catch (err) { next(err) }
  },
  addFollowing: async (req, res, next) => {
    try {
      const { userId } = req.params
      // 反查 撈出要被追蹤者的資料 與 追蹤資料
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: req.user.id, // 目前登入者的id
            followingId: req.params.userId // 要追蹤的id
          }
        })
      ])
      // 如果被追蹤的人不存在
      if (!user) throw new Error("User didn't exist!")
      // 如果已經追蹤過
      if (followship) throw new Error('You are already following this user!')

      // 如果沒有追蹤過
      await Followship.create({
        followerId: req.user.id,
        followingId: userId
      })
      res.redirect('back')
    } catch (err) { next(err) }
  },
  removeFollowing: async (req, res, next) => {
    try {
      //  反查追蹤資料
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      if (!followship) throw new Error("You haven't followed this user!")
      await followship.destroy()
      res.redirect('back')
    } catch (err) { next(err) }
  }
}

module.exports = userController
