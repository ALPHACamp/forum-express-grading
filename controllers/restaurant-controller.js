const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
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
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count)
        })
      }).catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: [Category, Comment] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        const restJSON = restaurant.toJSON()
        // restJSON.commentCounts = restJSON.Comments.length
        res.render('dashboard', { restaurant: restJSON })
      })
    // return Restaurant.findByPk(req.params.id, {
    //   include: Category
    // })
    //   .then(restaurant => {
    //     if (!restaurant) throw new Error("Restaurant didn't exist!")
    //     res.render('dashboard', { restaurant: restaurant.toJSON() })
    //   })
    //   .catch(err => next(err))
  }
}
module.exports = restaurantController
