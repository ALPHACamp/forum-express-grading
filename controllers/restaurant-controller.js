const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? {categoryId} : {}
        }
      })
      const categories = await Category.findAll({ raw: true })
      const data = restaurants.map(item => ({
        ...item,
        description: item.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants: data, categories, categoryId })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: Category
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
