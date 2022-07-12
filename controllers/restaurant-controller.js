const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const FIRST_RENDER_PAGE = 1
    const DEFAULT_LIMIT = 9

    try {
      const page = Number(req.query.page) || FIRST_RENDER_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: [Category],
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

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // show only first 50 characters
      }))
      return res.render('restaurants', { // go to restaurants.hbs
        restaurants: data,
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
      let restaurant = await Restaurant.findByPk(req.params.rest_id, {
        include: [
          Category,
          { model: Comment, include: [User] }
        ],
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant

      await restaurant.increment('viewCounts', { by: 1 })
      restaurant = restaurant.toJSON()
      return res.render('restaurant', {
        restaurant
      })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.rest_id, {
        include: [Category],
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant

      const comments = await Comment.findAndCountAll(
        {
          where: {
            restaurantId: req.params.rest_id
          }
        }
      )

      return res.render('dashboard', {
        restaurant,
        commentCounts: comments.count
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = restaurantController
