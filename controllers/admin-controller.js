const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },
  createRestaurant: (req, res) => { return res.render('admin/create-restaurant') },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create({ name, tel, address, openingHours, description })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({ name, tel, address, openingHours, description })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
