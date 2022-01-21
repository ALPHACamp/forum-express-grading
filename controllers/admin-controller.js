const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant.hbs')
  },

  postRestaurant: (req, res, next) => {
    const {
      name, tel, address, openingHours, description
    } = req.body

    if (!name) throw new Error('Restaurant name is required!')

    return Restaurant.create({
      name, tel, address, openingHours, description
    })
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
