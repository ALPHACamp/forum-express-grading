const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helper/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAUT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAUT_LIMIT
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
        const data = restaurants.rows.map(r => ({ // findAndCountAll 獲得的餐廳陣列存在 restaurants.rows
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // findAndCountAll 才能獲得 restaurants.count 搜到的資料總數
        })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, {
        model: Comment, include: User
      }],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        // console.log(restaurant.Comments[0].dataValues)
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant is not exist!')
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
