const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把Sequelize包裝過的物件轉換成JS原生物件
    }).then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(e => next(e))
  }
}

module.exports = adminController
