const { Restaurant } = require('../models')

const adminController = {
  // 管理者登入餐廳首頁
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true }) // 資料清洗
      if (restaurants) res.render('admin/restaurants', { restaurants })
    } catch (e) {
      next(e)
    }
  },
  // 管理者新增頁面
  createRestaurant: (req, res, next) => {
    res.render('admin/create-restaurant')
  }
}
module.exports = adminController
