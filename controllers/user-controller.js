const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 使用者註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 使用者註冊功能
  signUp: async (req, res, next) => {
    // 若前後密碼不一致
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    try {
      const findUser = await User.findOne({ where: { email: req.body.email } })
      // 若Email已註冊
      if (findUser) throw new Error('Email already exists!')

      const passwordHash = await bcrypt.hash(req.body.password, 12)
      const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      })
      if (createUser) {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      }
    } catch (err) {
      next(err)
    }
  },
  // 使用者登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 使用者登入功能
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    // // 判斷是否具備管理者權限：是→後台首頁、否→前台首頁
    // if (req.user.dataValues.isAdmin) {
    //   res.redirect('/admin/restaurants')
    // } else {
    //   res.redirect('/restaurants')
    // }
    res.redirect('/restaurants')
  },
  // 使用者登出功能
  signout: (req, res) => {
    req.logout()
    req.flash('success_messages', '登出成功！')
    res.redirect('/signin')
  },
  // 使用者個人頁面
  getUser: async (req, res, next) => {
    const { id } = req.params // string
    const userId = req.user?.id || id // number
    try {
      const user = await User.findByPk(id, {
        raw: true,
        nest: true
      })
      if (!user) throw new Error("User didn't exist!")
      const comments = await Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { userId: id },
        include: Restaurant
      })
      return res.render('users/profile', { user, userId, comments })
    } catch (e) {
      next(e)
    }
  },
  // 編輯使用者個人資料頁面
  editUser: async (req, res, next) => {
    const { id } = req.params // string
    const userId = req.user?.id || id // number
    if (Number(id) !== userId) {
      req.flash('error_messages', "Not allow to edit other's profile")
      return res.redirect(`/users/${id}`)
    }
    try {
      const user = await User.findByPk(id, { raw: true, nest: true })
      if (!user) throw new Error("User didn't exist!")
      return res.render('users/edit', { user })
    } catch (e) {
      next(e)
    }
  },
  // 修改使用者資料
  putUser: async (req, res, next) => {
    const { id } = req.params
    const userId = req.user?.id || id
    if (Number(id) !== userId) {
      req.flash('error_messages', "Not allow to edit other's profile")
      return res.redirect(`/users/${id}`)
    }
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    try {
      const [user, filePath] = await Promise.all([User.findByPk(id), imgurFileHandler(file)])
      if (!user) throw new Error("User didn't exist.")

      await user.update({ name, image: filePath || user.image })
      req.flash('success_messages', '使用者資料編輯成功')

      return res.redirect(`/users/${user.id}`)
    } catch (e) {
      next(e)
    }
  },
  // 使用者收藏餐廳
  addFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const favorite = await Favorite.findOne({ where: { userId: req.user.id, restaurantId } })
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({ userId: req.user.id, restaurantId })
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者移除收藏餐廳
  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({ where: { userId: req.user.id, restaurantId: req.params.restaurantId } })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者喜歡餐廳
  addLike: async (req, res, next) => {
    const { restaurantId } = req.params
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const like = await Like.findOne({ where: { userId: req.user.id, restaurantId } })
      if (like) throw new Error('You have liked this restaurant!')
      await Like.create({ userId: req.user.id, restaurantId })
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者收回喜歡
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({ where: { userId: req.user.id, restaurantId: req.params.restaurantId } })
      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽美食達人
  getTopUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
      const result = await users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      })).sort((a, b) => b.followerCount - a.followerCount) // sort結果大於1為DESC、小於1為ASC
      return res.render('top-users', { users: result })
    } catch (e) {
      next(e)
    }
  },
  // 使用者追蹤美食達人
  addFollowing: async (req, res, next) => {
    const { id } = req.user
    const { userId } = req.params
    if (id === Number(userId)) throw new Error("You cann't follow yourself!")
    try {
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")
      const follow = await Followship.findOne({
        where: {
          followerId: id,
          followingId: userId
        }
      })
      if (follow) throw new Error('You are already following this user!')
      await Followship.create({
        followerId: id,
        followingId: userId
      })
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者取消追蹤美食達人
  removeFollowing: async (req, res, next) => {
    try {
      const follow = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      if (!follow) throw new Error("You haven't followed this user!")
      await follow.destroy()
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = userController
