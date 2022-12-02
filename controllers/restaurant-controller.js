const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit, // fetch limit筆資料
        offset, // skip offset筆資料
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const indexDescriptionLength = 50
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, indexDescriptionLength)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err)) // 補上
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ],
      order: [[{ model: Comment }, 'created_at', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
