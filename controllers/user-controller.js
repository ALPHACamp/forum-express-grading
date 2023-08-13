const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment, Favorite } = db
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
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
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [Restaurant]
        }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User not found!')

        const userForRender = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          commentedRestaurants: (user.Comments || []).map(comment => {
            return {
              id: comment.Restaurant.id,
              image: comment.Restaurant.image
            }
          })
        }

        return res.render('users/profile', { user: userForRender })
      })
      .catch(err => next(err))
  },

  editUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User not found!')

        const userForRender = {
          id: user.id,
          name: user.name,
          image: user.image
        }

        return res.render('users/edit', { user: userForRender })
      })
      .catch(err => next(err))
  },

  putUser: async (req, res, next) => {
    try {
      console.log(req.body)
      const id = Number(req.params.id)
      console.log('User ID:', id)
      const { name } = req.body
      if (!name) throw new Error('User name is missing!')
      const { file } = req

      const catchUser = await User.findByPk(id)
      if (!catchUser) throw new Error('User not found!')

      const [user, filePath] = await Promise.all([
        catchUser,
        imgurFileHandler(file)
      ])

      await user
        .update({
          name,
          image: filePath || user.image
        })
        .then(() => {
          req.flash('success_messages', '使用者資料編輯成功')
          res.redirect(`/users/${user.id}`)
        })
        .catch(err => next(err))
    } catch (err) {
      console.log('Error in putUser:', err.message)
      next(err)
    }
  },

  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('Restaurant not found!')
        if (favorite) throw new Error('Already favorite!')
        return Favorite.create({
          restaurantId,
          userId: req.user.id
        })
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  },

  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        restaurantId: req.params.restaurantId,
        userId: req.user.id
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('Favorite not found!')
        return favorite.destroy()
      })
      .then(() => {
        res.redirect('back')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
