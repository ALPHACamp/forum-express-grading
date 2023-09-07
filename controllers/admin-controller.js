const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

module.exports = {
  async getRestaurants (_req, res, next) {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })

      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  async createRestaurant (_req, res) {
    res.render('admin/create-restaurant')
  },
  async postRestaurant (req, res, next) {
    try {
      const { name, tel, address, openingHours, description } = req.body

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Restaurant name is required')

      const filePath = await localFileHandler(req.file)
      await Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null })
      req.flash('success_message', 'A restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  async getRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })

      if (!restaurant) throw new Error('The restaurant is not existed.')
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  async editRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })

      if (!restaurant) throw new Error('The restaurant is not existed.')
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  async putRestaurant (req, res, next) {
    try {
      const { name, tel, address, openingHours, description } = req.body

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Restaurant name is required')

      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.id),
        localFileHandler(req.file)
      ])

      if (!restaurant) throw new Error('The restaurant is not existed')
      await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image })
      req.flash('success_message', 'The restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  async deleteRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (!restaurant) throw new Error('The restaurant is not existed')
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}
