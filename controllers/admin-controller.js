const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurants: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res,next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('名字是必填欄位')
    Restaurant.create({
      name, tel, address, openingHours, description
    }).then(() => {
      req.flash('success_messages', '新增餐廳成功')
      res.redirect('/admin/restaurants')
    }).catch(err => next(err))
  }
}

module.exports = adminController
