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
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])
      const restaurantData = restaurants.rows.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50)
      }))

      return res.render('restaurants', {
        restaurants: restaurantData,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurantData.count)
      })
    } catch (error) {
      return next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User }
        ]
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      restaurant.increment('viewCounts', {
        where: { id: req.params.id },
        by: 1
      })

      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id,
        {
          include: Category,
          raw: true,
          nest: true
        })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return res.render('dashboard', { restaurant })
    } catch (error) {
      return next(error)
    }
  },

  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [Category],
          raw: true,
          nest: true
        }),
        Comment.findAll({
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant],
          raw: true,
          nest: true
        })
      ])

      if (!restaurants) throw new Error("Restaurant didn't exist!")

      return res.render('feeds', { restaurants, comments })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
