const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant, Comment } = db
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
          .then(hash => User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
          }))
          .then(() => {
            res.redirect('/signin')
          })
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: Comment, include: [Restaurant]
      }]
    })
      .then(user => {
        const commentedRestaurants = user.Comments.map(e => e.dataValues.restaurantId)
        const uniqRestaurantsSet = new Set(commentedRestaurants)
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          where: { id: [...uniqRestaurantsSet] }
        })
          .then(restaurants => {
            console.log(restaurants)
            return res.render('users/profile', {
              user: user.toJSON(),
              restaurants: restaurants.rows,
              restaurantsCount: restaurants.count
            })
          })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('users/edit', { user: user.toJSON() })
      })
  },
  putUser: (req, res, next) => {
    const { name, email } = req.body
    const userId = req.params.id
    const { file } = req
    if (!name) throw new Error('Name is required!')
    return Promise.all([
      User.findByPk(userId),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (user.id !== req.user.id) throw new Error('您不是使用者本人，無法進行操作!')
        return user.update({
          name,
          email,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
