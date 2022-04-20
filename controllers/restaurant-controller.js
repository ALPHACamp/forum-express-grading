const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      const revisedRestaurants = restaurants.map(res => ({
        ...res,
        description: res.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: revisedRestaurants })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
