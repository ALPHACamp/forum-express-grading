const { Restaurant } = require('../models')
const restaurant = require('../models/restaurant')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurants: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('名字是必填欄位')
    Restaurant.create({
      name, tel, address, openingHours, description
    }).then(() => {
      req.flash('success_messages', '新增餐廳成功')
      res.redirect('/admin/restaurants')
    }).catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error('沒有這個餐廳')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error('沒有這個餐廳')
        res.render('admin/edit-restaurant', { restaurant })
      }).catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('名字不可空白')
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('沒有這個餐廳')
        return restaurant.update({ name, tel, address, openingHours, description })
        // 注意這邊要加return 讓findByPk有返回值 才能讓後續接.then
      }).then(() => {
        req.flash('success_message', '編輯餐廳成功')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('沒有這個餐廳')
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }

}

module.exports = adminController
