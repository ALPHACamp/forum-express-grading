const { Restaurant } = require('../models') // === require('../models/index')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // [{}, {}]
      raw: true // 轉成單純 JS 物件，不轉也可以但要在.dataValues 取值
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(error => next(error))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.create({ ...req.body })
      .then(() => {
        req.flash('success_messages', '餐廳新增成功!')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
