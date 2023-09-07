const { Restaurant } = require('../models')

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
      const name = req.body.name

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Restaurant is required')
      await Restaurant.create({ ...req.body })
      req.flash('success_message', 'A restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}
