
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffSet, getOpagination } = require('../helpers/pagination-helper')
const assert = require('assert')
const restaurantController = {

  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffSet(page, limit)
    try {
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          limit: limit,
          offset: offset,
          include: [Category],
          where: { ...categoryId ? { categoryId } : {} }
        }),
        Category.findAll({ raw: true })
      ])
      const data = restaurants.rows.map(r => {
        return {
          ...r, description: r.description.substring(0, 50)
        }
      })

      return res.render('restaurants',
        {
          restaurants: data,
          categories,
          categoryId,
          pagination: getOpagination(page, limit, restaurants.count)

        })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category, { model: Comment, include: User }],
        order: [[Comment, 'createdAt', 'DESC']]

      })
      assert(restaurant, '找不到指定餐廳')
      await restaurant.increment('viewCounts')// 計算瀏覽次數
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, { nest: true, raw: true, include: Category })
      const comment = await Comment.findAndCountAll({ where: { restaurantId: id } })
      res.render('dashboard', { restaurant, commentAmount: comment.count })
    } catch (error) {

    }
  }
}

module.exports = restaurantController
