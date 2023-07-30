
const { Restaurant } = require('../models')

const adminController = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // (頁面) 顯示新增餐廳表單
  createRestaurant: (req, res, next) => {
    return res.render('admin/create-restaurant')
  },
  // (功能) 新增餐廳
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Restaurant name is required!')

    Restaurant.create({ name, tel, address, openingHours, description })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
