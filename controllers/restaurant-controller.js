const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ include: Category, raw: true, nest: true })
      return res.render('restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category, raw: true, nest: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
