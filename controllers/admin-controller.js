const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ rwa: true })
      return res.render('admin/restaurants', restaurants)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
