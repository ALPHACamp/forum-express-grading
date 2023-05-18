const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Restaurant, User, Comment, Favorite, Like } = require('../models')

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    // 驗證：兩次密碼不同就回傳 Error
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Password do not match')
    }
    // 驗證：這個email還沒有被註冊，已經有的話回傳 Error
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
      .catch(err => {
        next(err)
      }) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    if (req.flash) {
      req.flash('success_messages', 'Sign in successfully.')
    }
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout successfully.')
    req.logout()
    res.redirect('/signin')
  },

  // Profile
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Restaurant
      },
      order: [
        [Comment, 'id', 'DESC']
      ],
      nest: true
    })
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        return res.render('users/profile', { user: user.toJSON() })
        // 使用 多層查詢不能使用 raw:true, 需要在最後使用 user.toJSON()
      })
      .catch(err => next(err))
  },

  // Edit Profile
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('User did not exist!')
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  putUser: (req, res, next) => {
    const { name } = req.body
    // 驗證名字
    if (!name) throw new Error('Name can not be empty!')

    // 找User + 上傳照片到imgur (取得url)
    // 記得要在 router 使用 multer middleware 來取得 req.file
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('Can not find user to edit!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  },

  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params

    // 要查 Restaurant 跟 Favorite 看看是否存在
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
        if (!restaurant) throw new Error('Restaurant did not exist!')
        if (favorite) throw new Error('You already favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params

    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('You did not have this restaurant favorited!')

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  addLike: (req, res, next) => {
    const { restaurantId } = req.params

    // 要查 Restaurant 跟 Like 看看是否存在
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant did not exist!')
        if (like) throw new Error('You already Liked this restaurant!')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  removeLike: (req, res, next) => {
    const { restaurantId } = req.params

    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error('You did not like this restaurant!')

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },

  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(d => d.id === user.id)
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount)

        return res.render('top-users', { users })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
