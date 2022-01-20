const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required')

    const { file } = req
    localFileHandler(file).then(filePath => Restaurant.create({
      name, tel, address, openingHours, description, image: filePath || null
    }))
      .then(() => {
        req.flash('success_msg', 'restaurant is successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant do not exist')

        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant do not exist')

        res.render('admin/edit', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required')

    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('Restaurant do not exist')

        return restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image })
      })
      .then(() => {
        req.flash('success_msg', 'restaurant is successfully update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant do not exist')

        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}

module.exports = adminController
