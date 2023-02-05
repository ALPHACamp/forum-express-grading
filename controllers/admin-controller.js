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
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description
      })
      req.flash('success_msg', '成功建立新餐廳!')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (!restaurant) throw new Error('此餐廳不存在!')
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
