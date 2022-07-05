// FilePath: controllers/admin-controllers.js
// Include modules
const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const fileHandler = imgurFileHandler

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
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      // Create new restaurant
      const { file } = req // Get image file
      const filePath = await fileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
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
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) { next(err) }
  },
  putRestaurant: async (req, res, next) => {
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      // Update restaurant info
      const { file } = req
      const filePath = await fileHandler(file)
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (!restaurant) throw new Error('Restaurant did not exist!')
      restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })
      req.flash('success_messages', 'Restaurant was successfully updated')
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error('Restaurant did not exist!')
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  }
}

module.exports = adminController
