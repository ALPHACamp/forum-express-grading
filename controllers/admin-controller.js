const { Restaurant } = require('../models')

module.exports = {
  async getRestaurants (_req, res, next) {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })

      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  }
}
