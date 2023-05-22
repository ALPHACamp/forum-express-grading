const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  // 使用者瀏覽前台所有餐廳
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 分頁預設值
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    try {
      const offset = getOffset(limit, page)
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: { ...categoryId ? { categoryId } : {} },
        offset,
        limit
      })
      const data = restaurants.rows.map(rest => ({ ...rest, description: rest.description.substring(0, 50) }))
      return res.render('restaurants', {
        categoryId,
        categories,
        restaurants: data,
        pagination: getPagination(limit, page, restaurants.count) // restaurants.count 為資料總數
      })
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await Restaurant.increment('view_counts', { where: { id } })
      return res.render('restaurant', { restaurant })
    } catch (e) {
      next(e)
    }
  },
  // 使用者查看單筆餐廳Dashboard
  getDashboard: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', { restaurant })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = restaurantController
