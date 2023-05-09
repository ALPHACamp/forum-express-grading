const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true
      })
      res.render('admin/restaurants', { restaurants })
    } catch (err) { next(err) }
  }
}
module.exports = adminController
