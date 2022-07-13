const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const Sequelize = require('sequelize')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || ''

      const [resData, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      const restaurants = resData.rows.map(res => ({
        ...res,
        description: res.description.substring(0, 50)
      }))
      res.render('restaurants', {
        restaurants,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) { next(err) }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User }
        ],
        order: [[Comment, 'createdAt', 'DESC']],
        nest: true
      })
      if (!restaurant) throw new Error('Restaurant does not exist!')
      await restaurant.increment('view_counts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) { next(err) }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.col('Comments.id')), 'commentCounts']]
        },
        include: [Category, Comment],
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error('Restaurant does not exist!')
      res.render('dashboard', { restaurant, commentCounts: restaurant.commentCounts })
    } catch (err) { next(err) }
  }
}

module.exports = restaurantController
