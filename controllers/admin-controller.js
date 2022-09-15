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
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('admin/restaurant', { restaurant })
      }).catch(error => next(error)) // 不知道會有什麼錯誤會產生，所以只要有錯誤就將錯誤往 middleware/error-handler.js 丟
  }
}

module.exports = adminController
