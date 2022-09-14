
const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: async (req, res) => {
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
      console.log('in admin-controller.js Line:26', error)
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true
      })
      if (!restaurant) throw new Error("Can't find restaurant , please search agian")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      console.log('in admin-controller.js Line:40', error)
      next(error)
    }
  }
}

module.exports = adminController
