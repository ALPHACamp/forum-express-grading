const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      /*
      Steps:
      1. find all restaurants and associated category data set from database
      2. shorten each restaurant's description in 50 characters
      3. variable data will get operated restaurants array after mapped
      spread operator: copy object r
      description: r.description.substring(0, 50): cover description with shorten one
      */
      const restaurants = await Restaurant.findAll({ include: Category, raw: true, nest: true })

      const data = await restaurants.map((item) => ({
        ...item,
        description: item.description.substring(0, 50),
      }))

      return res.render('restaurants', { restaurants: data })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      if (!restaurant) throw new Error('This restaurant does not exist!')

      await restaurant.increment('view_counts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category, raw: true, nest: true })
      if (!restaurant) throw new Error('This restaurant does not exist!')

      return res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = restaurantController
