// 後台

// 導入model
const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    // 渲染所有餐廳
    Restaurant.findAll({ raw: true })
      // 不使用raw:true，會回傳sequelize的instance。在沒有要用Sequelize做後續操作時，可以轉成JS原生物件。
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}

module.exports = adminController
