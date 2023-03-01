// 前台使用者用
const { Restaurant, Category } = require('../models')
const { nullCategoryHandle } = require('../helpers/object-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1 // 當前頁數(剛登入會是NaN所以要補 1)
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // restaurant per page
    const limitOption = [DEFAULT_LIMIT, 12, 24] // 產出 limit 選項
    const offset = getOffset(limit, page)
    const categoryId = (req.query.categoryId || req.query.categoryId === '0') ? Number(req.query.categoryId) : '' // 不能只寫(req.query.categoryId) 因為 categoryId=0 也要轉number
    try {
      const [restData, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          where: categoryId ? { categoryId } : categoryId === 0 ? { categoryId: null } : {},
          include: [Category],
          raw: true,
          nest: true,
          limit,
          offset
        }),
        Category.findAll({ raw: true })
      ])
      const pagination = getPagination(restData.count, limit, page)
      const restaurants = nullCategoryHandle(restData.rows)
      res.render('restaurants', { restaurants, categories, categoryId, pagination, limit, limitOption })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    const data = await Restaurant.findByPk(id, {
      include: [Category]
    })
    await data.increment('view_counts')
    const restaurant = nullCategoryHandle(data.toJSON())
    res.render('restaurant', { restaurant })
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
