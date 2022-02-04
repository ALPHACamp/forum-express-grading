const { Restaurant, Category } = require('../models')
const paginatorHelpers = require('../helpers/pagination-helpers')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // obtain current category
    const categoryId = Number(req.query.categoryId) || ''

    // define where condition for SQL
    const where = {}
    if (categoryId) where.categoryId = categoryId

    // define paginator setting
    const DEFAULT_LIMIT = 9
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const currentPage = Number(req.query.page) || 1
    const offset = paginatorHelpers.getOffset(DEFAULT_LIMIT, currentPage)

    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        where,
        limit,
        offset,
        include: [Category]
      })
    ])
      .then(([categories, restaurants]) => {
        const count = restaurants.count
        restaurants = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants,
          categories,
          categoryId,
          pagination: paginatorHelpers.getPagination(limit, currentPage, count)
        })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', {
        restaurant: restaurant.toJSON()
      }))
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        res.render('dashboard', { restaurant })
      })
  }
}

exports = module.exports = restaurantController
