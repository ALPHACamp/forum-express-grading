const { Restaurant, Category, View } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        raw: true,
        nest: true
      })
      return res.render('restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restInstance = await Restaurant.findByPk(req.params.id, {
        include: Category
      })
      if (!restInstance) throw new Error("Restaurant didn't exist!")

      // Update view count on restaurant
      const restaurant = await restInstance.increment('view_counts')

      // Update view data
      await View.create({
        userId: req.user.id,
        restaurantId: req.params.id
      })

      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (error) {
      next(error)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: Category })
      return res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
