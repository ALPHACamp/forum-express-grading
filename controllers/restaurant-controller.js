const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({ // 用findAndCountAll去算總共有幾間餐廳，才可以去算pagination的資訊
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        limit, // 加入分頁查詢條件
        offset, // 加入分頁查詢條件
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
      // map 整理出來的新陣列，需要多設一個變數 data 來接住回傳值的資料
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50) // 把敘述截斷為50個字，截取字串可用 substring()
        }))
        return res.render('restaurants', {
          restaurants: data, // 要使用的資料會放在 data
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        // raw: true,
        nest: true,
        include: Category
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        restaurant.increment('viewCounts')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        raw: true,
        nest: true,
        include: Category
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
