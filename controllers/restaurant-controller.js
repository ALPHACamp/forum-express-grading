const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = req.query.categoryId || ''
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: { ...categoryId ? { categoryId } : {} }
      })
      const categories = await Category.findAll({ raw: true })
      const data = await restaurants.map(restaurant => ({
        ...restaurant, description: restaurant.description.substring(0, 50) + '...'
      }))
      return res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, { include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      console.log(restaurant.viewCounts)
      await restaurant.increment('viewCounts')
      console.log(restaurant.viewCounts)
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, { raw: true, nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
