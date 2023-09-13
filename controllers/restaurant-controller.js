const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

module.exports = {
  async getRestaurants (req, res, next) {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          raw: true,
          include: Category,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      res.render('restaurants', {
        restaurants: restaurants.rows.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        })),
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  async getRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category, { model: Comment, include: User }],
        order: [[Comment, 'createdAt', 'DESC']]
      })

      await restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  async getDashboard (req, res, next) {
    try {
      res.render('dashboard', {
        restaurant: await Restaurant.findByPk(req.params.id, {
          raw: true,
          include: Category,
          nest: true
        })
      })
    } catch (err) {
      next(err)
    }
  }
}
