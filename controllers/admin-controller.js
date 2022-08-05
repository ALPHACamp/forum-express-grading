const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(e => next(e))
  },

  getCreateRestaurantPage: (req, res, next) => {
    return res.render('admin/create-restaurant')
  },

  postRestaurant: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.create(req.body)
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully created.')
        res.redirect('/admin/restaurants')
      })
      .catch(e => next(e))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(e => next(e))
  },

  getEditRestaurantPage: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(e => next(e))
  },

  putRestaurant: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update(req.body)
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully updated.')
        res.redirect('/admin/restaurants')
      })
      .catch(e => next(e))
  }
}
module.exports = adminController
