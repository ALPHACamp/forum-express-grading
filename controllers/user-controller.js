const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite, Like } = require('../models')
// import db for using db function
const db = require('../models/index')

const { imgurFileHandler } = require('../middleware/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res, next) => {
    const { name, password, email, passwordCheck } = req.body
    // Double check password
    if (password !== passwordCheck) throw new Error('Passwords do not match!')

    // Check if user exists
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })
      .catch(err => next(err))
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    return res.redirect('/signin')
  },

  // User profile
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })

      // Get unique commented restaurants
      // ===== SQL command below ====
      // SELECT
      //     COUNT(restaurant_id) AS `comments`,
      //     restaurant_id,
      //     user_id
      // FROM comments
      // WHERE user_id = {user.id}
      // GROUP BY restaurant_id;
      const comments = await Comment.findAll({
        where: { userId: user.id },
        attributes: [
          'restaurant_id',
          [
            db.sequelize.fn('count', db.sequelize.col('restaurant_id')),
            'comments'
          ]
        ],
        include: [Restaurant],
        group: ['restaurant_id'],
        raw: true,
        nest: true
      })

      const totalComments = comments.reduce(
        (acc, curr) => acc + curr.comments,
        comments[0].comments
      )

      return res.render('users/profile', {
        user,
        comments,
        commentedRestaurants: comments.length,
        totalComments
      })
    } catch (error) {
      next(error)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })

      return res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },

  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const { id } = req.params
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
    } catch (error) {
      next(error)
    }
  },

  // Favorite feature
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            restaurantId,
            userId: req.user.id
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')

      Favorite.create({
        restaurantId,
        userId: req.user.id
      })

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })

      if (!favorite) throw new Error("You haven't favorited this restaurant")

      favorite.destroy()

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  // Like feature
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            restaurantId,
            userId: req.user.id
          }
        })
      ])

      console.log(restaurant)

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (like) throw new Error('You have liked this restaurant!')

      Like.create({
        restaurantId,
        userId: req.user.id
      })

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },

  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          restaurantId: req.params.restaurantId,
          userId: req.user.id
        }
      })

      if (!like) throw new Error("You haven't liked this restaurant")

      like.destroy()

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
