const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res, next) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) {
      throw new Error('Restaurant name is required!')
    }
    Restaurant.create({
      name, tel, address, openingHours, description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  showRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => res.render('admin/restaurant', { restaurant }))
      .catch(err => next(err))
  }
}
module.exports = adminController
