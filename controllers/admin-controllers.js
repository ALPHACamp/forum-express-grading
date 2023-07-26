const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      // 將sequelize物件轉換成js原生物件(因為後續不需要再操作這包資料)
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
