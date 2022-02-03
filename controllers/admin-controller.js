const { Restaurant } = require('../models')

const adminController = {
  getRestaurant: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
