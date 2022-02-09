const { Restaurant, Category, User, Comment } = require('../models')
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
    return Restaurant.findByPk(id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
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
    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        restaurant = restaurant.toJSON()
        res.render('dashboard', { restaurant })
      })
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        include: [User, Restaurant],
        order: [
          ['createdAt', 'DESC']
        ]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
      .catch(error => next(error))
  }
}

exports = module.exports = restaurantController
