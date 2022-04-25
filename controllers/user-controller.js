const bcrypt = require('bcryptjs') // 載入 bcrypt
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => { // 修改這裡
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: async function (req, res) {
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
  getUser: async function (req, res, next) {
    try {
      console.log(req.user)
      if (req.user === undefined) {
        const user = await User.findByPk(req.params.id, {
          raw: true
        })
        const restaurantList = await Comment.findAll({
          where: {
            userId: req.params.id
          },
          raw: true,
          nest: true,
          include: [Restaurant]
        })
        const restaurantIdList = Array.from(new Set(restaurantList.map(item =>
          item.Restaurant.id
        )))
        const restaurant = await Restaurant.findAll({
          where: {
            id: restaurantIdList
          },
          raw: true
        })
        const numOfRestaurant = restaurant.length
        const commentExist = Boolean(restaurant.length)
        res.render('users/profile', { user, restaurant, numOfRestaurant, commentExist })
      }
      // edit button
      let personal
      req.user.id.toString() === req.params.id
        ? personal = true
        : personal = false
      // 評論的餐廳
      const user = await User.findByPk(req.params.id, {
        raw: true
      })
      const restaurantData = await Comment.findAll({
        where: {
          userId: req.params.id
        },
        attributes: ['Restaurant.id', 'Restaurant.image'],
        raw: true,
        nest: true,
        include: [{ model: Restaurant, attributes: [] }],
        group: ['id']
      })
      const restaurant = {
        data: restaurantData,
        count: restaurantData.length,
        exist: restaurantData.length >= 1
      }
      // FavoriteRestaurant
      const favorRestaurants = {
        data: req.user.FavoritedRestaurants,
        count: req.user.FavoritedRestaurants.length,
        exist: (req.user.FavoritedRestaurants.length) >= 1
      }
      // Following
      const followings = {
        data: req.user.Followings,
        count: req.user.Followings.length,
        exist: (req.user.Followings.length) >= 1
      }
      // Follower
      const followers = {
        data: req.user.Followers,
        count: req.user.Followers.length,
        exist: (req.user.Followers.length) >= 1
      }
      res.render('users/profile', {
        personal,
        user,
        restaurant: restaurant.data,
        numOfRestaurant: restaurant.count,
        commentExist: restaurant.exist,
        favorRestaurants: favorRestaurants.data,
        numOfFRestaurant: favorRestaurants.count,
        fRestaurantsExist: favorRestaurants.exist,
        followings: followings.data,
        numOfFollowings: followings.count,
        followingsExist: followings.exist,
        followers: followers.data,
        numOfFollowers: followers.count,
        followersExist: followers.exist
      })
    } catch (err) {
      next(err)
    }
  },
  editUser: (req, res, next) => {
    if (req.user !== undefined) {
      if (Number(req.params.id) !== req.user.id) {
        return res.redirect(`/users/${req.params.id}`)
      }
    }
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: async function (req, res, next) {
    const { name } = req.body
    const { file } = req
    const user = await User.findByPk(req.params.id)
    const filePath = await imgurFileHandler(file)
    if (!user) throw new Error("User didn't exist!")
    await user.update({
      name,
      image: filePath || user.image
    })
    req.flash('success_messages', '使用者資料編輯成功')
    res.redirect(`/users/${req.params.id}`)
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
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
  addLike: async function (req, res, next) {
    try {
      const { restaurantId } = req.params
      const restaurant = await Restaurant.findByPk(restaurantId)
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({
        userId: req.user.id,
        restaurantId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async function (req, res, next) {
    try {
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!like) throw new Error("You haven't liked this restaurant")
      await Like.destroy({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            myself: user.id !== req.user.id,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    if (userId === req.user.id.toString()) {
      return res.redirect('back')
    }
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
