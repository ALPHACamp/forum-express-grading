const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      // 將撈出來的資料從sequelize打包形式簡化成要用到的那些資訊
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return (res.render('admin/create-restaurant'))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, opneingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.create({
      name,
      tel,
      address,
      opneingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created!')
        res.redirect('/admin/restaurants')
      })
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
