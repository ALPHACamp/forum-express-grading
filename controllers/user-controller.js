const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('密碼 或 email 不正確！')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('密碼 或 email 不正確！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '帳號註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
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
  getUser: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAll({
        include: Restaurant,
        where: { userId },
        attributes: ['restaurant_id'],
        group: 'restaurant_id',
        raw: true,
        nest: true
      })
    ])
      .then(([user, restComments]) => {
        if (!user) throw new Error('使用者不存在！')
        return res.render('users/profile', { user, restComments })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('使用者名稱為必填欄位！')

    const authUser = getUser(req)
    const { file } = req

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在！')
        if (Number(user.id) === Number(authUser.id)) {
          return user.update({
            name,
            image: filePath || user.image
          })
        } else {
          req.flash('error_messages', '無法修改其它使用者資料！')
          return res.redirect(`/users/${authUser.id}`)
        }
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('餐廳不存在！')
        if (favorite) throw new Error('餐廳已經在最愛！')

        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', '餐廳加到最愛成功！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('最愛不存在！')

        return favorite.destroy()
      })
      .then(() => {
        req.flash('warning_messages', '餐廳移除最愛成功！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('餐廳不存在！')
        if (like) throw new Error('此餐廳已在喜歡名單！')

        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(() => {
        req.flash('success_messages', '已將餐廳加入 Like！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Like.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error('Like 不存在！')

        return like.destroy()
      })
      .then(() => {
        req.flash('warning_messages', '已將餐廳取消 Like！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 把 users 裡每個 user 項目都拿出來處理一次，並把新陣列儲存在 result 裡
        const result = users.map(user => ({
          ...user.toJSON(), // 整理格式
          followerCount: user.Followers.length, // 計算追蹤者人數
          isFollowed: req.user.Followings.some(f => f.id === user.id) // 判斷目前登入使用者是否已追蹤該 user 物件
        }))
          .sort((a, b) => b.followerCount - a.followerCount) // 數字由大到小排序
        return res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('使用者不存在！')
        if (followship) throw new Error('您已追蹤此使用者！')

        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => {
        req.flash('success_messages', '您正在追蹤此使用者！')
        return res.redirect('back')
      })
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
        if (!followship) throw new Error('使用者不存在！')
        return followship.destroy()
      })
      .then(() => {
        req.flash('warning_messages', '您已取消追蹤這位使用者！')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}
module.exports = userController
