const req = require('express/lib/request')
const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true
      })
      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  createRestaurant: (req, res) => res.render('admin/create-restaurant'),
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, descriptions } = req.body
      if (!name) throw new Error('Restaurant name is required')
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        descriptions
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('')
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
