const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper') // 加入這行

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 加入這行
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page) // 增加這裡
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作
    return Promise.all([
      // Restaurant.findAll({
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          // 新增查詢條件
          ...(categoryId ? { categoryId } : {}) // 檢查 categoryId 是否為空值
        },
        nest: true,
        raw: true,
        limit, // 增加這裡
        offset // 增加這裡
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        // const data = restaurants.map(r => ({
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId, // 新增這裡
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err)) // 補上
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        await restaurant.increment({ view_counts: 1 })
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
