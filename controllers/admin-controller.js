const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      const { file } = req
      const filePath = await localFileHandler(file)
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('admin/edit-restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const { file } = req
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')
      const filePath = await localFileHandler(file)
      const restaurant = await Restaurant.findByPk(restId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      req.flash('success_messages', 'restaurant was successfully delete')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
