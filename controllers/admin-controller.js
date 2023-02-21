// 後台專用
const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { Restaurant } = require('../models')
const { removesWhitespace } = require('../helpers/object-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    req.session.pathFrom = 'restaurants'
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
    req.session.pathFrom = `restaurants/${id}`
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => res.render('admin/restaurant-detail', { restaurant }))
      .catch(err => next(err))
  },
  editRestaurantPage: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { raw: true })
      .then(restaurant => res.render('admin/edit-restaurant', { restaurant }))
      .catch(err => next(err))
  },
  patchRestaurant: (req, res, next) => {
    const { id } = req.params
    const { pathFrom } = req.session // 利用這個紀錄是從 detail頁面進入編輯 or restaurants 頁面
    const restaurantData = removesWhitespace(req.body)
    return Restaurant.update(restaurantData, { where: { id } })
      .then(() => res.redirect(`/admin/${pathFrom}`))
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.destroy({ where: { id } })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
