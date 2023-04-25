const { Restaurant, User, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers.js')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const DEFAULT_LIMIT = 9
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const page = Number(req.query.page) || 1
      const offset = getOffset(page, limit)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({ raw: true, nest: true, include: [Category], where: { ...categoryId ? { categoryId } : null }, limit, offset }),
        Category.findAll({ raw: true })
      ])
      restaurants.rows.forEach(r => r = Object.assign(r, { description: r.description.substring(0, 50)}))
      res.render('restaurants', { restaurants: restaurants.rows, categories, categoryId, pagination: getPagination(restaurants.count, page, limit) })
    } catch (err) {
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category]})
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController