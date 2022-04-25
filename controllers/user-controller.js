const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, sequelize } = require('../models')

const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: async (req, res, next) => {
    try {
      return res.render('signup')
    } catch (err) {
      next(err)
    }
  },
  signUP: async (req, res, next) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (!name || !email || !password || !passwordCheck) throw new Error('所有欄位都需填寫！')

      if (password !== passwordCheck) throw new Error('兩次密碼不相符！')

      const user = await User.findOne({ where: { email } })
      if (user) throw new Error('該電子郵件已經註冊過！')

      const hash = bcrypt.hashSync(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '帳號成功註冊！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: async (req, res, next) => {
    try {
      return res.render('signin')
    } catch (err) {
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      return res.redirect('/restaurants')
    } catch (err) {
      next(err)
    }
  },
  logOut: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登出！')
      req.logout()
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [rawUser, comments] = await Promise.all([
        User.findByPk(userId),
        Comment.findAll({
          where: { userId },
          // 指定回傳的資料欄位
          attributes: [
            'restaurant_id',
            [
              sequelize.fn('COUNT', sequelize.col('restaurant_id')),
              'restaurant_comments'
            ]
          ],
          include: [Restaurant],
          group: ['restaurant_id'],
          raw: true,
          nest: true
        })
      ])

      if (!rawUser) throw new Error('該使用者不存在！')

      const totalComments = comments.reduce((accumulator, curValue) => {
        return accumulator + curValue.restaurant_comments
      }, 0)

      const user = { ...rawUser.toJSON() }

      return res.render('users/profile', { user, comments, totalComments })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const id = Number(req.params.id)

      if (id !== userId) {
        req.flash('error_messages', '無法編輯除了自己以外的使用者！')
        return res.redirect(`/users/${userId}`)
      }

      const user = await User.findByPk(id, { raw: true })
      return res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      if (!name) throw new Error('User name is required!')

      const { file } = req
      const [filePath, user] = await Promise.all([
        imgurFileHandler(file),
        User.findByPk(id)
      ])

      await user.update({
        name,
        image: filePath || user.image
      })

      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const userId = getUser(req).id

      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            restaurantId,
            userId
          }
        })
      ])

      if (!restaurant) throw new Error('無法收藏不存在的餐廳！')
      if (favorite) throw new Error('你已經收藏過此餐廳！')

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
    try {
      const { restaurantId } = req.params
      const userId = getUser(req).id

      const favorite = await Favorite.findOne({
        where: {
          restaurantId,
          userId
        }
      })

      if (!favorite) throw new Error('你尚未收藏此餐廳！')

      await favorite.destroy()

      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const userId = getUser(req).id

      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            restaurantId,
            userId
          }
        })
      ])

      if (!restaurant) throw new Error('無法喜愛不存在的餐廳！')
      if (like) throw new Error('你已喜愛過此餐廳！')

      await Like.create({
        restaurantId,
        userId
      })

      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const userId = getUser(req).id

      const like = await Like.findOne({
        where: {
          restaurantId,
          userId
        }
      })

      if (!like) throw new Error('你尚未喜愛過此餐廳！')

      await like.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
