// - 處理屬於restaurant路由的相關請求
const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      // - render admin版的頁面
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
