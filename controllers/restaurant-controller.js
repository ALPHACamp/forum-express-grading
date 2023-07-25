const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        nest: true,
        raw: true
      })

      const data = restaurants.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50)
      }))

      return res.render('restaurants', {
        restaurants: data
      })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
