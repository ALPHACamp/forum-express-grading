const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = require('../models/')
const bcrypt = require('bcryptjs')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_message', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_message', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_message', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getUsers: async (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        if (!users) throw new Error("Restaurant didn't exist!")
        req.flash('success_message', 'Got Users list')
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  getAdminUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (user.isAdmin) {
          user.isAdmin = 'yes'
        } else {
          user.isAdmin = 'no'
        }
        return res.render('admin/user', { user })
      })
      .catch(err => next(err))
  },
  editAdminUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('admin/edit-user', { user })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        if (user.isAdmin) {
          user.update({
            isAdmin: false
          })
          req.flash('success_messages', '使用者權限變更成功')
          return res.redirect('/admin/users')
        } else {
          user.update({
            isAdmin: true
          })
          req.flash('success_messages', '使用者權限變更成功')
          return res.redirect('/admin/users')
        }
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
