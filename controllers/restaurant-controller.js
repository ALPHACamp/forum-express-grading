const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      const data = await restaurants.map(restaurant => ({
        ...restaurant, description: restaurant.description.substring(0, 50) + '...'
      }))
      return res.render('restaurants', { restaurants: data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
