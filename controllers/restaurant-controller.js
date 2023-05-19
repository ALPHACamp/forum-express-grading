const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaruantController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    try {
      const restaurants = await Restaurant.findAndCountAll({
        where: { ...(categoryId ? { categoryId } : {}) },
        limit,
        offset,
        raw: true,
        next: true,
        include: Category
      })
      const categories = await Category.findAll({ raw: true })
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (e) {
      next(e)
    }
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        {
          model: Comment,
          include: User,
          // 排序comment從新到舊, 在多層include情況，separate 和 order要搭配一起用
          separate: true,
          order: [['createdAt', 'DESC']]
        }
      ], // 拿出關聯的 Category model
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts')
        return res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category],
        raw: true,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (e) { next(e) }
  }
}

module.exports = restaruantController
