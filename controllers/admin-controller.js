// 後台專用
const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { Restaurant } = require('../models')
const { removesWhitespace } = require('../helpers/object-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    sequelize.query('SELECT id, name FROM restaurants', { type: QueryTypes.SELECT })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurantPage: (req, res) => {
    res.render('admin/create-restaurant')
  },
  createRestaurant: (req, res, next) => {
    const restaurantData = req.body
    return Restaurant.create(removesWhitespace(restaurantData))
      .then(r => req.flash('success_messages', `成功新增餐廳：${r.name || '未命名餐廳'}`))
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getRestaurantDetail: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true })
      .then(restaurants => res.render('admin/restaurant-detail', { restaurants }))
  }
}
module.exports = adminController
