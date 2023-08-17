const bcrypt = require('bcryptjs')
const {
  User,
  Comment,
  Restaurant,
  Favorite,
  Like,
  Followship
} = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  // 導向註冊頁
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 註冊功能
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    // 確認資料裡面沒有一樣的 email
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return 傳到下一個 then
      })
      .then(hash =>
        User.create({
          // 寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  // 導向登入頁
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 登入功能
  signIn: (req, res) => {
    // 在 routes/index.js 用 Passport 的 middleware
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出功能
  logout: (req, res, next) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },
  // 取得使用者
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        include: Restaurant,
        where: { user_id: userId },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        res.render('users/profile', {
          user,
          count: comments.count,
          comments: comments.rows
        })
      })
      .catch(err => next(err))
  },
  // 編輯使用者
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // 修改使用者
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('Name is required!')
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error_messages', '不能更改!')
      res.redirect('/restaurants')
    }
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  // 加入收藏清單
  addFavorite: (req, res, next) => {
    // 取網址 id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          // passport 傳的 id
          userId: req.user.id,
          // params.id
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
  // 從收藏清單移除
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
  },
  // like
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId: req.user.id, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ userId: req.user.id, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // unlike
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // 美食達人
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        users = users.map(user => ({
          // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: users })
      })
      .catch(err => next(err))
  },
  // 追蹤使用者
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  // 退追
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
