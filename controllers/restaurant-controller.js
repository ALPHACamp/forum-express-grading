const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: Category,
      where: { ...categoryId ? { categoryId } : {} },
      limit,
      offset
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category,
          { model: Comment, include: User }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts', { by: 1 })
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        include: [User, Restaurant],
        order: [['createdAt', 'DESC']],
        limit: 10
      })
    ])
      .then(([restaurants, comments]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 100)
        })
        )
        return res.render('feeds', { restaurants: data, comments })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
