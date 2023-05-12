const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    const { name } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create(req.body)
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
