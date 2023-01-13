const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Like, Followship, Favorite } = db
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來，處理圖片

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 有輸入值為空白的情況
    if (!name.trim() || !email || !password || !passwordCheck) {
      throw new Error('All fields are required, cannot be blank!')
    }
    // 兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (password !== passwordCheck) {
      throw new Error('Password check is not match with password!')
    }
    User.findOne({ where: { email } })
      .then(user => {
        // Email已經註冊過，就建立一個 Error 物件並拋出
        if (user) {
          throw new Error('Email is already registered!')
        }
        // 都沒錯誤則進行雜湊（必須return，then才會接到）
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '註冊成功')
        res.redirect('/signin')
      })
      .catch(err => next(err, req)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/restaurants')
  },
  logOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      User.findByPk(id, { raw: true }),
      Comment.findAndCountAll({
        where: { userId: id },
        include: Restaurant,
        raw: true,
        nest: true
      })
    ])
      .then(([user, commits]) => {
        if (!user) throw new Error('User is not existed!')
        res.render('users/profile', { user, commits })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('User is not existed!')
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { id } = req.params
    const { file } = req
    const { name } = req.body
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User is not existed!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { restaurantId, userId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        if (favorite) throw new Error('This is already added to favorite!')
        return Favorite.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: { restaurantId, userId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: { restaurantId, userId }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        if (like) throw new Error('Already liked!')
        return Like.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Like.findOne({
      where: { restaurantId, userId }
    })
      .then(like => {
        if (!like) throw new Error('Have not liked!')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const followingId = req.params.userId
    const followerId = req.user.id
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: { followingId, followerId }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('User is not existed!')
        if (followship) throw new Error('Already followed')
        Followship.create({ followingId, followerId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followingId = req.params.userId
    const followerId = req.user.id
    return Followship.findOne({
      where: { followingId, followerId }
    })
      .then(followship => {
        if (!followship) throw new Error('Have not followed')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        const data = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length, // 計算追蹤者人數
            isFollowed: req.user.Followings.some(following => following.id === user.id) // 判斷目前登入使用者是否已追蹤該 user 物件
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: data })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
