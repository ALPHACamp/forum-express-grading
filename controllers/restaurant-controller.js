const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // 9 data pre page
      const DEFAULT_LIMIT = 9

      // get values from req query and trun them into number
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      // req.query.limit: incase to make selector to let user select how many data showed per page
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      /*
      where: { searching condition }
      if categoryId exists >> where: { categoryId: categoryId }
        findA all data with this categoryId
      if categoryId doesn't exist >> where: {}
        find all data

        also can write:
        const where = {}
        if (categoryId) where.categoryId = categoryId
        ... where: where ...
      */
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: { ...(categoryId ? { categoryId } : {}) },
          limit,
          offset,
          raw: true,
          nest: true,
        }),
        Category.findAll({ raw: true }),
      ])
      // restaurants { count: 50, row: [{item}, {item}, ...] }

      const data = await restaurants.rows.map((item) => ({
        ...item,
        description: item.description.substring(0, 50),
      }))

      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count),
      })
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
