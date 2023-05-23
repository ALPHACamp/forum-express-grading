const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match!')
      }
      // 確認 email 是否已註冊，如有就建立一個 Error 物件並拋出
      const user = await User.findOne({ where: { email } })

      if (user) {
        throw new Error('Email already exists!')
      }

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
      res.redirect('/signin')
    } catch (e) {
      next(e)
    } // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Restaurant
      },
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        const commentRestaurant = user.Comments
          ? user.Comments.map(comment => comment.Restaurant.dataValues)
          : 0
        // 可以直接回傳user.toJSON()再透過user.Comments>取出this.Restaurant.id/image
        return res.render('users/profile', {
          user: user.toJSON(),
          commentRestaurant
        })
      })
      .catch(e => next(e))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        return res.render('users/edit', { user })
      })
      .catch(e => next(e))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('Name is required!')
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(e => next(e))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Favorite.findOne({ where: { userId, restaurantId } })
      .then(favorite => {
        if (!favorite) {
          throw new Error("You haven't favorited this restaurant!")
        }

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Like.findOne({ where: { userId, restaurantId } })
      .then(like => {
        if (!like) {
          throw new Error("You haven't liked this restaurant!")
        }

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
      // 重整所有users資料
        users = users
          .map(user => ({
            ...user.toJSON(),
            // 追蹤人數
            followerCount: user.Followers.length,
            // 目前登入帳號是否有追蹤此user
            isFollowed: req.user && req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        // sort會以字典順序來排, 要比較[a,b], a=b 回傳0 排序不動, a>b 回傳負值 a在b前， a<b 回傳正值 b在a前

        res.render('top-users', { users })
      })
      .catch(e => next(e))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) {
          throw new Error('You are already following this user!')
        }
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    return Followship.findOne({
      where: {
        followingId: userId,
        followerId: req.user.id
      }
    })
      .then(followship => {
        if (!followship) {
          throw new Error("You haven't followed this user!")
        }

        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  }
}

module.exports = userController
