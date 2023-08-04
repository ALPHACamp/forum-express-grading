const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        nest: true,
        raw: true
      })
      const data = await restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants: data })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, ({
        include: Category
      }))
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const incrementData = await restaurant.increment('viewCounts')

      res.render('restaurant', { restaurant: incrementData.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, ({
        include: Category,
        nest: true,
        raw: true
      }))

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
