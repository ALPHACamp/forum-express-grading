const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(error => next(error))
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Restaurant name is required')

    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'restaruants was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('admin/restaurant', { restaurant })
      })
      .catch(error => next(error))
  },

  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('admin/edit-restaurant', { restaurant })
      })
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Restaurant name is required')

    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
