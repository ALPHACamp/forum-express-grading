const bcrypt = require('bcryptjs')
// 先取出model中的User(資料表格式?)
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  // render 註冊的頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 負責實際處理註冊的行為
  signUp: (req, res, next) => {
    // 判斷兩次密碼是否相符
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 判斷email是否已註冊
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 若已有使用者，回傳錯誤訊息
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
        // 在這裡return可丟到下一個then函式
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
  // 登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  // 使用者檔案
  // getUser: (req, res, next) => {
  //   const userId = req.params.id
  //   return Promise.all([Comment.findAndCountAll({ where: { userId }, include: Restaurant }),
  //   User.findByPk(userId, { raw: true })])
  //     .then(([comments, userProfile]) => {
  //       const userComments = comments.rows.map(element => { return element.toJSON() })
  //       const count = comments.count
  //       if (!userProfile) throw new Error("User didn't exist!")
  //       res.render('users/profile', { user: getUser(req), userProfile, userComments, count })
  //     })
  //     .catch(err => next(err))
  // },
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([User.findByPk(userId, { raw: true }),
    Comment.findAll({ where: { userId }, include: Restaurant, nest: true, raw: true })])
      .then(([userProfile, comments]) => {
        if (!userProfile) throw new Error("User didn't exist!")
        res.render('users/profile', { user: getUser(req), userProfile, comments })
      })
      .catch(err => next(err))
  },

  // 使用者檔案編輯頁面
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  // 送出編輯結果
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const userId = req.params.id
    if (!name) throw new Error('User name is required!')
    return Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        // user name 重複驗證
        return user.update({ name, image: filePath || user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId),
    Favorite.findOne({ where: { userId: req.user.id, restaurantId } })])// 確認這個收藏的關聯是否存在？
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))// 回到上一頁
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({ where: { userId: req.user.id, restaurantId: req.params.restaurantId } })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant!")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    console.log(req.params)
    console.log(req.params.restaurantId)
    return Promise.all([Restaurant.findByPk(restaurantId), Like.findOne({ where: { userId: req.user.id, restaurantId } })])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ userId: req.user.id, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({ where: { userId: req.user.id, restaurantId: req.params.restaurantId } })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      // .then(users => { // 這裡的users是有"users的追蹤者"資料的陣列
      //   // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
      //   users = users.map(user => ({
      //     // 這裡users變數有重複使用，可以優化，但使用者這個版本的好處是節省資源空間。
      //     ...user.toJSON(),
      //     // 計算追蹤者人數
      //     followerCount: user.Followers.length,
      //     // 判斷目前登入使用者的"追蹤名單"內是否已追蹤該 user 物件(user.id)
      //     isFollowed: req.user.Followings.some(f => f.id === user.id)
      //   }))
      //   users = users.sort((a, b) => b.followerCount - a.followerCount)
      //   res.render('top-users', { users: users })
      // })

      // 這個寫法可以保有users原始資料
      .then(users => {
        const result = users
          .map(user => ({// 這行有延遲現象????
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  // 追蹤別人
  addFollowing: (req, res, next) => {
    const { userId } = req.params // 路由抓取的userId
    Promise.all([User.findByPk(userId), Followship.findOne({ where: { followerId: req.user.id, followingId: userId } })])// 抓資料 followship裡的followerId為登入者，以及followingId(追蹤的對象)為資料傳入的id
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")// 要追蹤的使用者是否存在
        if (followship) throw new Error('You are already following this user!')// 是否已追蹤過
        return Followship.create({
          followerId: req.user.id, followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
