const { Restaurant } = require('../models') // 帶入database

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // 抓取所有 Restaurant 資料
      raw: true // 簡化資料，類.lean()
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
