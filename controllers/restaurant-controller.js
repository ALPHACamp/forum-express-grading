const { Restaurant, Category, View, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../middleware/pagination-helper')

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
          where: { ...(categoryId ? { categoryId } : {}) },
          include: Category,
          limit,
          offset,
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      return res.render('restaurants', {
        restaurants: restaurants.rows,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      // Eager Loading
      const restInstance = await Restaurant.findByPk(req.params.id, {
        include: [Category, { model: Comment, include: User }]
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
