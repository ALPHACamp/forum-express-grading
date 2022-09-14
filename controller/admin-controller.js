
const { Restaurant } = require('../models')

const adminController = {
  getRestaurant: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      console.log(error)
    }
  },
  createRestaurant: (req, res) => {
    res.render('create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    // 取出表單中的資料
    const { name, tel, address, openingHours, description } = req.body
    try {
      // 檢查必填欄位
      if (!name) throw new Error('Restaurant name is required!')
      await Restaurant.create({ name, tel, address, openingHours, description })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      console.log('in admin-controller.js', error)
      next(error)
    }
  }
}

module.exports = adminController
