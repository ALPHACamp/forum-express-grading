// - 處理屬於前台restaurant路由的相關請求
const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    try {
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          raw: true,
          nest: true,
          where: {
            ...(categoryId ? { categoryId } : {})
          },
          include: [Category]
        }),
        Category.findAll({ raw: true })
      ])
      // - 對原有description進行字數刪減
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId
      })
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('此餐廳不存在!')
      // - 若餐廳存在增加瀏覽次數(累加值若為1可省略第二參數)
      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('此餐廳不存在!')
      return res.render('dashboard', { restaurant })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
