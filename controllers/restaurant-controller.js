const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const restaurants = await Restaurant.findAll({ include: Category, nest: true, raw: true, where: { ...categoryId ? { categoryId } : {} } })
      const categories = await Category.findAll({ raw: true })
      const data = restaurants.map(r => ({
        ...r, description: r.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (err) {
      console.log(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category, nest: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('view_counts')
      console.log(restaurant.view_counts)
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      console.log(req.params)
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category, nest: true, raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
