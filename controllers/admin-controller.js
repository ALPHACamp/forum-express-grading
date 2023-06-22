const { Restaurant } = require('../models') // 新增這裡

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把 Sequelize的一大包物件轉換成格式較單純JS 原生物件
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
