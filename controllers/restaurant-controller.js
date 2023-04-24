const { Restaurant, User, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      restaurants.forEach(r => r = Object.assign(r, { description: r.description.substring(0, 50)}))
      res.render('restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController