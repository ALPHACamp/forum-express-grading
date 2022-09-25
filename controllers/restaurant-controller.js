const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        include: Category,
        raw: true,
        nest: true
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
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
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("The restaurant doesn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      // 用於查詢該餐廳的所有評論
      Comment.findAll({
        where: {
          restaurantId: req.params.id
        }
      })
    ])
      .then(([restaurant, comments]) => {
        if (!restaurant) throw new Error("The restaurant doesn't exist!")
        const commentCounts = comments.length
        res.render('dashboard', {
          restaurant,
          commentCounts
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
