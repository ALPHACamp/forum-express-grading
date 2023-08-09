const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 若沒有加''categoryId會變成NaN

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 展開運算子的優先順序晚於三元運算子
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({
        raw: true
      })
    ])
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
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      // 原寫法
      // .then(restaurant => {
      //   if (!restaurant) throw new Error("Restaurant didn't exist!")
      //   restaurant.viewCounts += 1
      //   return restaurant.save()
      // })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', {
        restaurant: restaurant.toJSON()
      }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
