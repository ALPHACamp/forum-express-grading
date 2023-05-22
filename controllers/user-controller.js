const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFieldHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    try {
      //* 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (password !== passwordCheck) throw new Error('Passwords do not match!')
      const user = await User.findOne({ where: { email } })
      //* 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
      if (user) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash,
        image: `https://robohash.org/set_set1/bgset_bg1/${Math.random()}?size=500x500`
      })
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      //* 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
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
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) {
        return next(err)
      }
      req.flash('success_messages', '登出成功！')
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    // 取得id
    const { id } = req.params
    // 如果沒有req.user就回傳id，使其一定會一樣
    const signInUserId = req.user?.id || id
    try {
      // 找對應user
      const user = await User.findByPk(id, { include: { model: Comment, include: Restaurant }, order: [[{ model: Comment }, 'createdAt', 'DESC']] })
      // 沒有就報錯
      if (!user) throw new Error('User did not exist!')
      // 判斷瀏覽的使用者是否為本人
      const selfUser = signInUserId === Number(id) ? 1 : 0
      // 有就render
      return res.render('users/profile', { user: user.toJSON(), selfUser })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    // 取得id
    const { id } = req.params
    const userId = req.user?.id || id
    try {
      // 找對應User
      const user = await User.findByPk(id, { raw: true })
      // 沒有就報錯
      if (!user) throw new Error('User did not exist!')
      // 如果user跟登入的user不同就報錯
      if (id !== userId) throw new Error('Cannot modify other user profile!')
      // 有就render
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    // 取得body資料
    const { name } = req.body
    // 取得id
    const { id } = req.params
    // 取得file
    const { file } = req
    try {
      // 名字如果是空的就報錯
      if (!name) throw new Error('Name is required!')
      // 找對應User
      // 使用imgurFieldHandler
      const [user, filePath] = await Promise.all([User.findByPk(id), imgurFieldHandler(file)])
      // 沒有就報錯
      if (!user) throw new Error('User did not exist!')
      // 如果user跟登入的user不同就報錯
      if (user.id !== req.user.id) throw new Error('Cannot modify other user profile!')
      // user內容更新，image用||判斷有無更改
      await user.update({
        name,
        image: filePath || user.image
      })
      // 提示修改成功
      req.flash('success_messages', '使用者資料編輯成功')
      // redirect
      return res.redirect(`/users/${user.id}`)
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: { userId, restaurantId }
        })
      ])
      if (!restaurant) throw new Error('Restaurant did not exist!')
      if (favorite) throw new Error('Restaurant has favorited')
      await Favorite.create({
        userId,
        restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
      if (!favorite) throw new Error('Restaurant has not favorited')
      await favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    // 取出restaurantId、userId
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      // 找對應restaurant，找不到報錯
      // 找尋有無like，有就說不能再用
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: { restaurantId, userId }
        })
      ])
      if (!restaurant) throw new Error('Restaurant did not exist!')
      if (like) throw new Error('Restaurant has liked!')
      // Create
      await Like.create({ restaurantId, userId })
      // redirect
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    // 取restaurantId, userId
    const { restaurantId } = req.params
    const userId = req.user.id
    try {
      // 找對應restaurant，找不到報錯
      // 找尋有無like，有就說不能再用
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: { restaurantId, userId }
        })
      ])
      if (!restaurant) throw new Error('Restaurant did not exist!')
      if (!like) throw new Error('Restaurant has not liked!')
      // destroy
      await like.destroy()
      // redirect
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      // 取得User資料包含followers
      const users = await User.findAll({ include: { model: User, as: 'Followers' } })
      // 陣列加入follower數量及是否被當前user followed
      // 依follower數量排序
      const result = users
        .map(user => ({
          ...user.toJSON(), // 整理格式
          followerCount: user.Followers.length, // 計算追蹤者人數
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: user.Followers.some(f => f.id === req.user.id)
        }))
        .sort((a, b) => b.followerCount - a.followerCount)
      // render
      return res.render('top-users', { users: result })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: async (req, res, next) => {
    // 取出userId、loginUserId
    const followingId = req.params.userId
    const followerId = req.user.id
    try {
      // 找出對應user及有無follow
      const [user, following] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: { followingId, followerId }
        })
      ])
      // 找不到user就報錯
      if (!user) throw new Error('User did not exist!')
      // 有follow資料報錯
      if (following) throw new Error('Has followed!')
      // create
      await Followship.create({ followingId, followerId })
      // redirect
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    // 取出userId、loginUserId
    const followingId = req.params.userId
    const followerId = req.user.id
    try {
      // 找出對應user及有無follow
      const [user, following] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: { followingId, followerId }
        })
      ])
      // 找不到user就報錯
      if (!user) throw new Error('User did not exist!')
      // 有follow資料報錯
      if (!following) throw new Error('Has not followed!')
      // 刪除
      await following.destroy()
      // redirect
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
