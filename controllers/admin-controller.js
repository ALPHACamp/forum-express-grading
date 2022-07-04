// FilePath: controllers/admin-controllers.js
// Include modules
const { Restaurant } = require('../models')

// Controller
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      res.render('admin/restaurants', { restaurants })
    } catch (err) { next(err) }
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    try {
      // Check if required info got null
      if (!name) throw new Error('Restaurant name is required!')
      // Create new restaurant
      await Restaurant.create({ name, tel, address, openingHours, description })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/restaurant', { restaurant })
    } catch (err) { next(err) }
  }
}

module.exports = adminController
