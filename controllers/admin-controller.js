const { Restaurant } = require('../models') // === require('../models/index')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // [{}, {}]
      raw: true // 轉成單純 JS 物件，不轉也可以但要在.dataValues 取值
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(error => next(error))
  }
}

module.exports = adminController
