const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper.js')
const restController = {
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('dashboard', { restaurant })
    })
      .catch(err => next(err))
  },
  getRestaurants: (req, res) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        nest: true,
        raw: true,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r, description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    }).then(restaurant => {
      const viewCounts = restaurant.viewCounts
      if (!restaurant) throw new Error('Restaurant did not exist!')
      return restaurant.update({ viewCounts: viewCounts + 1 })
    }).then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  }
}
module.exports = restController
