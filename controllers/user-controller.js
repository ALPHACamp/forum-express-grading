const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helpers')
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
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
        req.flash('success_messages', 'Sign up SUCCESS.')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Logon Success.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout Success.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    req.user = getUser(req)
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(viewUser => {
        if (!viewUser) throw new Error("User didn't exist.")

        let comments = []
        if (viewUser.toJSON().Comments) {
          comments = viewUser.toJSON().Comments.reduce((accu, current) => {
            if (!accu.find(item => item.Restaurant.id === current.Restaurant.id)) {
              accu.push(current)
            }
            return accu
          }, [])
        }

        const user = req.user

        res.render('users/profile', { viewUser: viewUser.toJSON(), comments, user })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    req.user = getUser(req)
    if (Number(req.params.id) !== req.user.id) throw new Error("Can't edit not your own profile.")
    return User.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")

        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    req.user = getUser(req)
    if (!name) throw new Error('User name is required!')
    if (Number(req.params.id) !== req.user.id) throw new Error("Can't edit not your own profile.")
    const { file } = req

    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")

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
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const user = getUser(req)

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        if (favorite) throw new Error("You've favorited this restaurant.")

        return Favorite.create({
          userId: user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const user = getUser(req)
    return Favorite.findOne({
      where: {
        userId: user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restuarnat.")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const userId = getUser(req).id
    const { restaurantId } = req.params

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
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        if (like) throw new Error("You've liked this restaurant.")

        return Like.create({
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const userId = getUser(req).id
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restuarnat.")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
