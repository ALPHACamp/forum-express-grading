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
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('restaurant', { restaurant: restaurant.toJSON() })
      await restaurant.increment('viewCounts')
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
