const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // get categoryId from req query and trun it to number
      const categoryId = Number(req.query.categoryId) || ''

      /*
      where: { searching condition }
      if categoryId exists >> where: { categoryId: categoryId }
        findA all data with this categoryId
      if categoryId doesn't exist >> where: {}
        find all data
      */
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          include: Category,
          where: { ...(categoryId ? { categoryId } : {}) },
          raw: true,
          nest: true,
        }),
        Category.findAll({ raw: true }),
      ])

      const data = await restaurants.map((item) => ({
        ...item,
        description: item.description.substring(0, 50),
      }))

      return res.render('restaurants', { restaurants: data, categories, categoryId })
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
