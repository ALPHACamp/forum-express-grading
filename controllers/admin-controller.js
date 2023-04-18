const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },

  createRestaurant: (req, res, next) => {
    res.render('admin/create-restaurant')
  },

  postRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) throw new Error('Restaurant name is required!')
      await Restaurant.create(Object.assign({}, req.body))
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController