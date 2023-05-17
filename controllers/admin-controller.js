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
    return res.render('admin/create-restaurant')
  },
  // 管理者新增功能
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required.')

      // const { file } = req
      // const filePath = await imgurFileHandler(file)
      const newRestaurant = await Restaurant.create({ name, tel, address, openingHours, description }) // , image: filePath || null })
      if (newRestaurant) {
        req.flash('success_msg', 'Restaurant was successfully created.')
        res.redirect('/admin/restaurants')
      }
    } catch (e) {
      next(e)
    }
  },
  // 管理者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true })
      if (!restaurant) throw new Error("Restaurant didn't exist.")
      res.render('admin/restaurant', { restaurant })
    } catch (e) {
      next(e)
    }
  }
}
module.exports = adminController
