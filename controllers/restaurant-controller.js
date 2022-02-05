const { User, Restaurant, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = req.query.page === '0' ? 0 : Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAndCountAll({
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset: getOffset(limit, page),
        raw: true,
        nest: true,
        include: Category
      })
    ])
      .then(([categories, restaurants]) => {
        const pagination = getPagination(limit, page, restaurants.count)
        if (!pagination.pages.includes(page)) throw new Error("Page didn't exist")
        restaurants = restaurants.rows.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          categories,
          restaurants,
          categoryId,
          pagination
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, {
        nest: true,
        include: [
          Category,
          { model: Comment, include: User }
        ]
      })
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => res.render('dashboard', { restaurant }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
