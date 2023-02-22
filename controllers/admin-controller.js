// 後台專用
const { sequelize } = require('../models')
const { QueryTypes } = require('sequelize')
const { Restaurant } = require('../models')
const { removesWhitespace } = require('../helpers/object-helpers')
const { localFileHandler } = require('../helpers/file-helpers')

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
    localFileHandler(req.file)
      .then(imgPath => {
        const restaurantData = removesWhitespace({ ...req.body, image: imgPath })
        if (!restaurantData.name) throw new Error('餐廳名稱為必填')
        return Restaurant.create(restaurantData)
      })
      .then(restaurant => {
        req.flash('success_messages', `成功新增餐廳：${restaurant.name}`)
        res.redirect('/admin/restaurants')
      })
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
    localFileHandler(req.file)
      .then(imgPath => {
        const restaurantData = removesWhitespace({ ...req.body, image: imgPath })
        if (!restaurantData.name) throw new Error('餐廳名稱為必填')
        return Restaurant.update(restaurantData, { where: { id } })
          .then(() => {
            req.flash('success_messages', '成功修改餐廳')
            res.redirect(`/admin/${pathFrom}`)
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.destroy({ where: { id } })
      .then(restaurant => {
        req.flash('success_messages', '成功刪除餐廳')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
