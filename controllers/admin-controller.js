const { Restaurant, User } = require('../models')
const helpers = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    const type = 'restaurant'
    return Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { type, restaurants }))
      .catch(error => next(error))
  },
  getUsers: (req, res, next) => {
    const type = 'user'
    return User.findAll({ raw: true })
      .then(users => {
        users.forEach(user => {
          user.permissionOptionValue = !user.isAdmin
        })
        res.render('admin/users', { type, users })
      })
      .catch(error => next(error))
  },
  patchUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error('User didn\'t exist!')

        if (user.email === process.env.SUPERUSER_EMAIL) {
          req.flash('error_messages', '禁止變更 root 權限')
          res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        // avoid user from inputing id in url
        if (!restaurant) throw new Error('Restaurant didn\'t exist!')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  createRestaurant: (req, res, next) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    helpers.imgurFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  editRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        res.render('admin/edit-restaurant', { restaurant })
      })
  },
  putRestaurant: (req, res, next) => {
    const id = req.params.id
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    Promise.all([
      Restaurant.findByPk(id),
      helpers.imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) =>
        restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  deleteRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', '你已成功刪除餐廳')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }

}

exports = module.exports = adminController
