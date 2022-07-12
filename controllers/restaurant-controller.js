const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      const data = restaurants.map(rest => ({
        ...rest,
        description: rest.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants: data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
