const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          limit,
          offset,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          include: [Category]
        }),
        Category.findAll({ raw: true })
      ])
      const revisedRestaurants = restaurants.rows.map(res => ({
        ...res,
        description: res.description.substring(0, 50)
      }))

      return res.render('restaurants', {
        restaurants: revisedRestaurants,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category, {
          model: Comment, include: [User]
        }]
      })
      if (!restaurant) throw new Error('該餐廳不存在！')

      await restaurant.increment('view_counts')

      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('該餐廳不存在！')

      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
