const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) { throw new Error('Restaurant name is required!') } // 前後端不同步所以都要設定
    Restaurant.create({ name, tel, address, openingHours, description })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}

module.exports = adminController
