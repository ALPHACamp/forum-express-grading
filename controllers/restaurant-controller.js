const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: Category })
    const data = restaurants.map(rest => ({ ...rest, description: rest.description.substring(0, 50) }))
    return res.render('restaurants', { restaurants: data })
  }
}
module.exports = restaurantController
